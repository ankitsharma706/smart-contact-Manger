/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { Person } from '../models/Person.ts';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'contacts.csv');

export class ContactService {
  constructor() {
    this.ensureDataFileExists();
  }

  private ensureDataFileExists() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(FILE_PATH)) {
      const header = 'NAME,PHONE,EMAIL,CREATED_AT\n';
      fs.writeFileSync(FILE_PATH, header);
    }
  }

  async getAll(): Promise<Person[]> {
    try {
      const content = fs.readFileSync(FILE_PATH, 'utf-8');
      const lines = content.trim().split('\n');
      if (lines.length <= 1) return [];

      return lines.slice(1).map(line => {
        // Simple CSV parser for quoted strings
        const parts = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (!parts || parts.length < 4) return null;
        
        const removeQuotes = (str: string) => str.replace(/^"|"$/g, '');
        return new Person(
          removeQuotes(parts[0]),
          removeQuotes(parts[1]),
          removeQuotes(parts[2]),
          removeQuotes(parts[3])
        );
      }).filter(p => p !== null) as Person[];
    } catch (error) {
      console.error('Error reading contacts:', error);
      return [];
    }
  }

  async add(person: Person): Promise<void> {
    const contacts = await this.getAll();
    if (contacts.some(c => c.email === person.email)) {
      throw new Error('Contact with this email already exists.');
    }
    fs.appendFileSync(FILE_PATH, person.toCSV() + '\n');
  }

  async delete(email: string): Promise<void> {
    const contacts = await this.getAll();
    const filtered = contacts.filter(c => c.email !== email);
    this.saveAll(filtered);
  }

  async update(oldEmail: string, updatedPerson: Person): Promise<void> {
    const contacts = await this.getAll();
    const index = contacts.findIndex(c => c.email === oldEmail);
    if (index === -1) throw new Error('Contact not found');
    
    // Check if new email is taken by someone else
    if (oldEmail !== updatedPerson.email && contacts.some(c => c.email === updatedPerson.email)) {
      throw new Error('New email already exists for another contact.');
    }

    contacts[index] = updatedPerson;
    this.saveAll(contacts);
  }

  async filter(options: { query?: string, exact?: boolean, startDate?: string, endDate?: string }): Promise<Person[]> {
    let contacts = await this.getAll();
    const { query, exact, startDate, endDate } = options;

    if (query) {
      const q = query.toLowerCase();
      contacts = contacts.filter(c => {
        if (exact) {
          return c.name.toLowerCase() === q || c.email.toLowerCase() === q || c.phone === q;
        }
        return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q);
      });
    }

    if (startDate) {
      const start = new Date(startDate).getTime();
      contacts = contacts.filter(c => new Date(c.createdAt).getTime() >= start);
    }

    if (endDate) {
      const end = new Date(endDate).getTime() + 86399999; // Include the entire end day
      contacts = contacts.filter(c => new Date(c.createdAt).getTime() <= end);
    }

    return contacts;
  }

  private saveAll(contacts: Person[]) {
    const header = 'NAME,PHONE,EMAIL,CREATED_AT\n';
    const content = header + contacts.map(c => c.toCSV()).join('\n') + (contacts.length > 0 ? '\n' : '');
    fs.writeFileSync(FILE_PATH, content);
  }
}

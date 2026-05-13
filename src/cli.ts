/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import readlineSync from 'readline-sync';
import { ContactService } from './services/contactService.ts';
import { Person } from './models/Person.ts';

const contactService = new ContactService();

function displayMenu() {
  console.log('\n--- Smart Contact Manager (CLI) ---');
  console.log('1. View All Contacts');
  console.log('2. Add New Contact');
  console.log('3. Search Contacts');
  console.log('4. Delete Contact');
  console.log('5. Exit');
}

async function main() {
  let exit = false;
  while (!exit) {
    displayMenu();
    const choice = readlineSync.question('Select an option: ');

    switch (choice) {
      case '1':
        const contacts = await contactService.getAll();
        console.table(contacts.map(c => ({
          Name: c.name,
          Phone: c.phone,
          Email: c.email,
          'Created At': new Date(c.createdAt).toLocaleString()
        })));
        break;

      case '2':
        const name = readlineSync.question('Name: ');
        const phone = readlineSync.question('Phone: ');
        const email = readlineSync.question('Email: ');

        if (!name || !phone || !email) {
          console.error('All fields are required.');
          break;
        }

        try {
          const person = new Person(name, phone, email);
          await contactService.add(person);
          console.log('Contact added successfully!');
        } catch (e: any) {
          console.error('Error:', e.message);
        }
        break;

      case '3':
        const query = readlineSync.question('Search query: ');
        const results = await contactService.filter({ query });
        console.table(results);
        break;

      case '4':
        const emailToDelete = readlineSync.question('Enter email of contact to delete: ');
        await contactService.delete(emailToDelete);
        console.log('Contact deleted (if it existed).');
        break;

      case '5':
        exit = true;
        break;

      default:
        console.log('Invalid option.');
    }
  }
}

main();

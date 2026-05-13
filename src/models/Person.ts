/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export class Person {
  name: string;
  phone: string;
  email: string;
  createdAt: string;

  constructor(name: string, phone: string, email: string, createdAt?: string) {
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.createdAt = createdAt || new Date().toISOString();
  }

  toCSV(): string {
    return `"${this.name}","${this.phone}","${this.email}","${this.createdAt}"`;
  }
}

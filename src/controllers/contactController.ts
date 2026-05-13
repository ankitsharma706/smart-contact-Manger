/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import { ContactService } from '../services/contactService.ts';
import { Person } from '../models/Person.ts';

const contactService = new ContactService();

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const contacts = await contactService.getAll();
    const recentContacts = contacts.slice(-5).reverse();
    res.render('index', { 
      contacts, 
      recentContacts, 
      count: contacts.length,
      page: 'dashboard'
    });
  } catch (error) {
    res.status(500).send('Error loading dashboard');
  }
};

export const getContactsList = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    const exact = req.query.exact === 'on';
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    const contacts = await contactService.filter({
      query,
      exact,
      startDate,
      endDate
    });

    res.render('contacts/list', { 
      contacts, 
      query, 
      exact, 
      startDate, 
      endDate, 
      page: 'contacts' 
    });
  } catch (error) {
    res.status(500).send('Error loading contacts');
  }
};

export const getNewContactForm = (req: Request, res: Response) => {
  res.render('contacts/new', { error: null, data: {}, page: 'new' });
};

export const createContact = async (req: Request, res: Response) => {
  const { name, phone, email } = req.body;
  
  // Validation
  if (!name || !phone || !email) {
    return res.render('contacts/new', { error: 'All fields are required', data: req.body, page: 'new' });
  }
  
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.render('contacts/new', { error: 'Invalid email format', data: req.body, page: 'new' });
  }

  try {
    const newPerson = new Person(name, phone, email);
    await contactService.add(newPerson);
    req.flash('success_msg', 'Contact added successfully!');
    res.redirect('/contacts');
  } catch (error: any) {
    res.render('contacts/new', { error: error.message, data: req.body, page: 'new' });
  }
};

export const getEditContactForm = async (req: Request, res: Response) => {
  try {
    const contacts = await contactService.getAll();
    const contact = contacts.find(c => c.email === req.params.email);
    if (!contact) return res.status(404).send('Contact not found');
    res.render('contacts/edit', { contact, error: null, page: 'contacts' });
  } catch (error) {
    res.status(500).send('Error loading edit form');
  }
};

export const updateContact = async (req: Request, res: Response) => {
  const oldEmail = req.params.email;
  const { name, phone, email } = req.body;

  try {
    const updatedPerson = new Person(name, phone, email);
    await contactService.update(oldEmail, updatedPerson);
    req.flash('success_msg', 'Contact updated successfully!');
    res.redirect('/contacts');
  } catch (error: any) {
    const contact = { name, phone, email };
    res.render('contacts/edit', { contact, error: error.message, page: 'contacts' });
  }
};

export const deleteContact = async (req: Request, res: Response) => {
  try {
    await contactService.delete(req.params.email);
    req.flash('success_msg', 'Contact removed from registry.');
    res.redirect('/contacts');
  } catch (error) {
    res.status(500).send('Error deleting contact');
  }
};

export const exportCSV = async (req: Request, res: Response) => {
  try {
    const contacts = await contactService.getAll();
    const header = 'NAME,PHONE,EMAIL,CREATED_AT\n';
    const csv = header + contacts.map(c => c.toCSV()).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).send('Error exporting CSV');
  }
};

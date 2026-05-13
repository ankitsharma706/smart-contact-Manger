/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import * as contactController from '../controllers/contactController.ts';

const router = express.Router();

router.get('/', contactController.getDashboard);
router.get('/contacts', contactController.getContactsList);
router.get('/contacts/new', contactController.getNewContactForm);
router.post('/contacts', contactController.createContact);
router.get('/contacts/edit/:email', contactController.getEditContactForm);
router.post('/contacts/update/:email', contactController.updateContact);
router.post('/contacts/delete/:email', contactController.deleteContact);
router.get('/contacts/export', contactController.exportCSV);

export default router;

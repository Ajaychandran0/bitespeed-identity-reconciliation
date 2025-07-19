import { Request, Response } from "express";
import Contact from "../models/contact";
import { Op } from "sequelize";
import { uniq } from "lodash";

class ContactController {
  async identifyContact(req: Request, res: Response) {
    const { email, phoneNumber } = req.body;

    // Step 1: Find all matching contacts
    const queryConditions: Array<{ email?: string; phoneNumber?: string }> = [];
    if (email) queryConditions.push({ email });
    if (phoneNumber) queryConditions.push({ phoneNumber });

    const matchingContacts = await Contact.findAll({
      where: {
        [Op.or]: queryConditions
      },
    });

    // Step 2: If no match, create primary contact
    if (matchingContacts.length === 0) {
      const newContact = await Contact.create({
        email,
        phoneNumber,
        linkPrecedence: "primary"
      });

      return res.json({
        contact: {
          primaryContactId: newContact.id,
          emails: [newContact.email].filter(Boolean),
          phoneNumbers: [newContact.phoneNumber].filter(Boolean),
          secondaryContactIds: []
        }
      });
    }

    // Step 3: For each unique primary, get secondaries
    const primaryIDs = uniq(matchingContacts.map(c => c.linkPrecedence === "primary" ? c.id : c.linkedId)) as bigint[];
    const primaryContacts: Contact[] = await Contact.findAll({
      where: {
        id: { [Op.in]: primaryIDs },
        linkPrecedence: "primary"
      },
      order: [
        // oldest first (true primary first)
        ['createdAt', 'ASC']
      ]
    })

    const mainPrimary = primaryContacts[0];

    // If more than one primary contact found
    if (primaryContacts.length > 1) {
      const otherPrimaries = primaryContacts.slice(1);
      const otherPrimaryIds = otherPrimaries.map(c => c.id);

      // Downgrade otherPrimaries to secondary and link to main primary
      await Contact.update({
        linkPrecedence: 'secondary',
        linkedId: mainPrimary.id
      }, {
        where: {
          [Op.or]: [
            { id: { [Op.in]: otherPrimaryIds } },
            { linkedId: { [Op.in]: otherPrimaryIds } }
          ]
        }
      });
    }

    // Step 4: Collect all emails and phone numbers from related contacts
    const allRelatedContacts = await Contact.findAll({
      where: {
        [Op.or]: [
          { id: mainPrimary.id },
          { linkedId: mainPrimary.id }
        ]
      },
      order: [
        // "primary" comes before "secondary", then oldest first
        ['linkPrecedence', 'ASC'],
        ['createdAt', 'ASC']
      ]
    });

    const allEmails = new Set<string>();
    const allPhones = new Set<string>();
    const secondaryIds: BigInt[] = [];
    allRelatedContacts.forEach(c => {
      if (c.email) allEmails.add(c.email);
      if (c.phoneNumber) allPhones.add(c.phoneNumber);
      if (c.linkPrecedence === "secondary") secondaryIds.push(c.id);
    });


    // check if new info was introduced
    const isNewEmail = email && !allEmails.has(email);
    const isNewPhone = phoneNumber && !allPhones.has(phoneNumber);

    // If new info, create secondary contact
    if (isNewEmail || isNewPhone) {
      const newContact = await Contact.create({
        email,
        phoneNumber,
        linkedId: mainPrimary.id,
        linkPrecedence: "secondary"
      });

      if (newContact.email) allEmails.add(newContact.email);
      if (newContact.phoneNumber) allPhones.add(newContact.phoneNumber);
      secondaryIds.push(newContact.id);
    }

    // Step 5: Return merged response
    return res.json({
      contact: {
        primaryContactId: mainPrimary.id,
        emails: [...allEmails],
        phoneNumbers: [...allPhones],
        secondaryContactIds: secondaryIds
      }
    });
  }
}

export default new ContactController();
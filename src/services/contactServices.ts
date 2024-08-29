import { prisma } from '../index';
import { Contact } from '@prisma/client';

export async function identifyContact(email: string | null, phoneNumber: string | null) {
  let primaryContact: Contact | null = null;
  let secondaryContacts: Contact[] = [];

  const existingContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { email: email || undefined },
        { phoneNumber: phoneNumber || undefined },
      ],
    },
    orderBy: { createdAt: 'asc' },
  });

  if (existingContacts.length > 0) {
    // Find the oldest primary contact
    primaryContact = existingContacts.find(c => c.linkPrecedence === 'PRIMARY') || existingContacts[0];
    console.log(primaryContact);
    
    // Identify and link secondary contacts
    const linkedId = primaryContact.id;
    secondaryContacts = existingContacts.filter(c => c.linkedId === linkedId && c.id !== linkedId);
    console.log(secondaryContacts);
    
    for (const contact of secondaryContacts) {
      if (contact.linkPrecedence === 'PRIMARY'  && contact.id !== linkedId) {
        // Change any other primary contact to secondary and link it to the main primary contact
        await prisma.contact.update({
          where: { id: contact.id },
          data: { linkedId:linkedId, linkPrecedence: 'SECONDARY' },
        });
        secondaryContacts.push(contact);
      }
    }

    // Check if incoming data has new email or phoneNumber
    if ((email && !existingContacts.some(c => c.email === email)) || 
        (phoneNumber && !existingContacts.some(c => c.phoneNumber === phoneNumber))) {
      const newSecondaryContact = await prisma.contact.create({
        data: {
          email: email || undefined,
          phoneNumber: phoneNumber || undefined,
          linkedId: primaryContact.id,
          linkPrecedence: 'SECONDARY',
        },
      });
      secondaryContacts.push(newSecondaryContact);
    }
  } else {
    // No existing contacts, create a new primary contact
    primaryContact = await prisma.contact.create({
      data: {
        email: email || undefined,
        phoneNumber: phoneNumber || undefined,
        linkPrecedence: 'PRIMARY',
      },
    });
  }

  // Consolidate emails and phone numbers, ensuring uniqueness
  const emails = [primaryContact.email, ...secondaryContacts.map(c => c.email)].filter(Boolean);
  const phoneNumbers = [primaryContact.phoneNumber, ...secondaryContacts.map(c => c.phoneNumber)].filter(Boolean);

  return {
    primaryContactId: primaryContact.id,
    emails: Array.from(new Set(emails)),
    phoneNumbers: Array.from(new Set(phoneNumbers)),
    secondaryContactIds: secondaryContacts.map(c => c.id),
  };
}
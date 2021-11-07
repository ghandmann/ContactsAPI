const db = require('./sqlite');

const { ContactAlreadyExistsError, EmailaddressAlreadyExistsError, PhonenumberAlreadyExistsError } = require('./customErrors');
class Addressbook {
    constructor() {
    }

    addContact(contact) {
        if(this.contactExistsByName(contact.firstname, contact.lastname)) {
            throw new ContactAlreadyExistsError(contact.firstname, contact.lastname);
        }

        db.prepare("INSERT INTO contacts (id, firstname, lastname, nickname, birthdate) VALUES(?, ?, ?, ?, ?)").run(contact.id, contact.firstname, contact.lastname, contact.nickname, contact.birthdate);
    }

    removeContact(contactId) {
        if(!this.contactExists(contactId)) {
            throw new Error("Cannot delete a contact that is not in the addressbook!");
        }

        db.prepare("DELETE FROM contacts WHERE id = ?").run(contactId);
    }

    getContacts() {
        return db.prepare("SELECT * FROM contacts").all();
    }

    contactExists(contactId) {
        const found = db.prepare("SELECT * FROM contacts WHERE id = ?").get(contactId);

        return !!found;
    }

    contactExistsByName(firstName, lastName) {
        const found = db.prepare("SELECT * FROM contacts WHERE firstname = ? AND lastname = ?").get(firstName, lastName);

        return !!found;
    }

    getPhonenumbersByContact(contactId) {
        const found = db.prepare("SELECT id FROM contacts WHERE id = ?").get(contactId);

        if(!found) {
            throw new Error(`No contact found for contactId='${contactId}`);
        }

        const phonenumbers = db.prepare("SELECT * FROM phonenumbers WHERE contactId = ?").all(contactId);

        return phonenumbers;
    }

    addPhoneNumber(id, contactId, phonenumber, category) {
        if(this.contactHasPhonenumber(contactId, phonenumber)) {
            throw new PhonenumberAlreadyExistsError(phonenumber, contactId);
        }

        db.prepare("INSERT INTO phoneNumbers (id, contactId, phoneNumber, category) VALUES (?, ?, ?, ?);").run(id, contactId, phonenumber, category);
    }

    contactHasPhonenumber(contactId, phonenumber) {
        const found = db.prepare("SELECT * FROM phonenumbers WHERE contactId = ? AND phonenumber = ?").get(contactId, phonenumber);

        return !!found;
    }

    deletePhoneNumber(contactId, phonenumberId) {
        const found = db.prepare("SELECT id FROM phonenumbers WHERE id = ? AND contactId = ?").get(phonenumberId, contactId);
        if(!found) {
            throw new Error(`No phonenumber with id='${phonenumberId}' for contactId='${contactId}' found!'`);
        }

        db.prepare("DELETE FROM phonenumbers WHERE id = ? AND contactId = ?").run(phonenumberId, contactId);
    }

    contactHasEmailaddress(contactid, emailaddress) {
        const found = db.prepare("SELECT * FROM emailaddresses WHERE contactId = ? AND emailaddress = ?").get(contactid, emailaddress);

        return !!found;
    }

    getEmailAddressesByContact(contactId) {
        this.ensureContactExists(contactId);

        const emailaddresses = db.prepare("SELECT * FROM emailaddresses WHERE contactId = ?").all(contactId);

        return emailaddresses;
    }

    ensureContactExists(contactId) {
        const contactExists = this.findContactById(contactId);
        
        if (!contactExists) {
            throw new Error(`No contact with contactId='${contactId}' found.`);
        }
    }

    addEmailAddress(id, contactId, emailaddress, category) {
        if(this.contactHasEmailaddress(contactId, emailaddress)) {
            throw new EmailaddressAlreadyExistsError(emailaddress, contactId);
        }
        
        db.prepare("INSERT INTO emailaddresses (id, contactId, emailaddress, category) VALUES (?, ?, ?, ?)").run(id, contactId, emailaddress, category);
    }

    deleteEmailAddress(id, contactId) {
        const found = db.prepare("SELECT * FROM emailaddresses WHERE id = ? AND contactId = ?").get(id, contactId);
        if(!found) {
            throw new Error(`No emailaddress with id='${id}' for contactId='${contactId}'`);
        }

        db.prepare("DELETE FROM emailaddresses WHERE id = ? AND contactId = ?").run(id, contactId);
    }

    findContactById(contactId) {
        return db.prepare("SELECT * FROM contacts WHERE id = ?").get(contactId);
    }
}

module.exports = Addressbook;
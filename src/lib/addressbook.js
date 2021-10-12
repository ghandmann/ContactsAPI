const db = require('./sqlite');

class Addressbook {
    constructor() {
    }

    addContact(contact) {
        if(this.contactExistsByName(contact.firstName, contact. lastName)) {
            throw new Error("Cannot add the same contact twice");
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
        const phonenumbers = db.prepare("SELECT * FROM phonenumbers WHERE contactId = ?").all(contactId);

        return phonenumbers;
    }

    addPhoneNumber(id, contactId, phonenumber, category) {
        if(this.contactHasPhonenumber(contactId, phonenumber)) {
            throw new Error(`Conctact with contactId=${contactId} already has phonenumber=${phonenumber}`);
        }

        db.prepare("INSERT INTO phoneNumbers (id, contactId, phoneNumber, category) VALUES (?, ?, ?, ?);").run(id, contactId, phonenumber, category);
    }

    contactHasPhonenumber(contactId, phonenumber) {
        const found = db.prepare("SELECT * FROM phonenumbers WHERE contactId = ? AND phonenumber = ?").get(contactId, phonenumber);

        return !!found;
    }

    deletePhoneNumber(contactId, phonenumberId) {
        db.prepare("DELETE FROM phonenumbers WHERE id = ? AND contactId = ?").run(phonenumberId, contactId);
    }

    contactHasEmailaddress(contactid, emailaddress) {
        const found = db.prepare("SELECT * FROM emailaddresses WHERE contactId = ? AND emailaddress = ?").get(contactid, emailaddress);

        return !!found;
    }

    getEmailAddressesByContact(contactId) {
        const emailaddresses = db.prepare("SELECT * FROM emailaddresses WHERE contactId = ?").all(contactId);

        return emailaddresses;
    }

    addEmailAddress(id, contactId, emailaddress, category) {
        if(this.contactHasEmailaddress(contactId, emailaddress)) {
            throw new Error(`Contact with contactId=${contactId} already has emailaddress=${emailaddress}`);
        }
        
        db.prepare("INSERT INTO emailaddresses (id, contactId, emailaddress, category) VALUES (?, ?, ?, ?)").run(id, contactId, emailaddress, category);
    }

    deleteEmailAddress(id, contactId) {
        db.prepare("DELETE FROM emailaddresses WHERE id = ? AND contactId = ?").run(id, contactId);
    }
}

module.exports = Addressbook;
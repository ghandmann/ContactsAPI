const Contact = require("./contact");

class Addressbook {
    // contacts = [];
    
    constructor() {
        this.contacts = [];
    }

    addContact(contact) {
        if(this.contactExists(contact)) {
            throw new Error("Cannot add the same contact twice");
        }

        this.contacts.push(contact);
    }

    removeContact(contact) {
        if(!this.contactExists(contact)) {
            throw new Error("cannot delete a contact that is not in the addressbook!");
        }

        this.contacts = this.contacts.filter(c => c.getIdentifier() != contact.getIdentifier());
    }

    contactExists(newContact) {
        this.assertIsContactObject(newContact);

        const found = this.contacts.find((candidate) => candidate.getIdentifier() == newContact.getIdentifier());

        return !!found;
    }

    assertIsContactObject(contact) {
        if(!(contact instanceof Contact)) {
            throw new Error("Addressbook only accepts object of Contact class!");
        }
    }
}

module.exports = Addressbook;
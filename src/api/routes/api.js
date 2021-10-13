var { nanoid } = require('../../lib/nanoid');
var express = require('express');
var router = express.Router();

const Addressbook = require("../../lib/addressbook");

const addressbook = new Addressbook();

router.get("/api/v1/contacts", (req, res) => {
    const contactsList = addressbook.getContacts();
    res.send(contactsList);
});

router.post("/api/v1/contacts", (req, res) => {
    const {firstname, lastname, nickname, birthdate } = req.body;

    if(!firstname || !lastname) {
        return res.status(400).send("firstname and lastname are mandatory!");
    }

    let newContact = { id: nanoid(), firstname, lastname, nickname, birthdate };
    
    addressbook.addContact(newContact);

    return res.status(200).send({ id: newContact.id });
})

router.delete("/api/v1/contacts", (req, res) => {
    const {contactId} = req.body;


    if(!addressbook.contactExists(contactId)) {
        return res.status(404).send();
    }
    
    addressbook.removeContact(contactId);
    
    return res.status(200).send();
});

router.get("/api/v1/phonenumbers/:contactId", (req, res) => {
    try {
        const phonenumbers = addressbook.getPhonenumbersByContact(req.params.contactId);
        return res.send(phonenumbers);
    }
    catch(error) {
        if(error.message.startsWith("No contact found for contactId=")) {
            return res.status(404).send(error.message);
        }

        throw error;
    }
});

router.post("/api/v1/phonenumbers/:contactId", (req, res) => {
    const { phoneNumber, category } = req.body;

    const newPhoneNumberId = nanoid();
    addressbook.addPhoneNumber(newPhoneNumberId, req.params.contactId, phoneNumber, category);

    return res.status(200).send({ id: newPhoneNumberId });
});

router.delete("/api/v1/phonenumbers/:contactId", (req, res) => {
    const { id } = req.body;

    try {
        addressbook.deletePhoneNumber(req.params.contactId, id);
        return res.status(200).send();
    }
    catch(error) {
        if(error.message.startsWith("No phonenumber with id")) {
            return res.status(404).send(error.message);
        }

        throw error;
    }
})

router.get("/api/v1/emailaddresses/:contactId", (req, res) => {
    try {

        const emailaddresses = addressbook.getEmailAddressesByContact(req.params.contactId);
    
        return res.send(emailaddresses);
    }
    catch(error) {
        if(error.message.startsWith("No contact with contactId=")) {
            return res.status(404).send(error.message);
        }
    }
});

router.post("/api/v1/emailaddresses/:contactId", (req, res) => {
    const { emailaddress, category } = req.body;

    const newEmailAddressId = nanoid();
    addressbook.addEmailAddress(newEmailAddressId, req.params.contactId, emailaddress, category);

    return res.status(200).send({ id: newEmailAddressId });
});

router.delete("/api/v1/emailaddresses/:contactId", (req, res) => {
    const { id } = req.body;

    try {
        addressbook.deleteEmailAddress(id, req.params.contactId);
        return res.status(200).send();
    }
    catch(error) {
        if(error.message.startsWith("No emailaddress with id=")) {
            return res.status(404).send(error.message);
        }

        throw error;
    }
});

module.exports = router;
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

    let newContact = { id: nanoid(), firstname, lastname, nickname, birthdate };
    
    addressbook.addContact(newContact);

    return res.status(200).send();
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
    const phonenumbers = addressbook.getPhonenumbersByContact(req.params.contactId);

    return res.send(phonenumbers);
});

router.post("/api/v1/phonenumbers/:contactId", (req, res) => {
    const { phoneNumber, category } = req.body;

    addressbook.addPhoneNumber(nanoid(), req.params.contactId, phoneNumber, category);

    return res.status(200).send();
});

router.delete("/api/v1/phonenumbers/:contactId", (req, res) => {
    const { id } = req.body;

    addressbook.deletePhoneNumber(req.params.contactId, id);

    return res.status(200).send();
})

router.get("/api/v1/emailaddresses/:contactId", (req, res) => {
    const emailaddresses = addressbook.getEmailAddressesByContact(req.params.contactId);

    return res.send(emailaddresses);
});

router.post("/api/v1/emailaddresses/:contactId", (req, res) => {
    const { emailaddress, category } = req.body;

    addressbook.addEmailAddress(nanoid(), req.params.contactId, emailaddress, category);

    return res.status(200).send();
});

router.delete("/api/v1/emailaddresses/:contactId", (req, res) => {
    const { id } = req.body;

    addressbook.deleteEmailAddress(id, req.params.contactId);

    return res.status(200).send();
});

module.exports = router;
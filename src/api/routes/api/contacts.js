var { nanoid } = require('../../../lib/nanoid');
var express = require('express');
var router = express.Router();

const Addressbook = require("../../../lib/addressbook");

const addressbook = new Addressbook();

router.get("/contacts", (req, res) => {
    const contactsList = addressbook.getContacts();
    res.send(contactsList);
});

router.post("/contacts", (req, res) => {
    const {firstname, lastname, nickname, birthdate } = req.body;

    if(!firstname || !lastname) {
        return res.status(400).send("firstname and lastname are mandatory!");
    }

    let newContact = { id: nanoid(), firstname, lastname, nickname, birthdate };
    
    addressbook.addContact(newContact);

    return res.status(200).send({ id: newContact.id });
})

router.delete("/contacts", (req, res) => {
    const {contactId} = req.body;


    if(!addressbook.contactExists(contactId)) {
        return res.status(404).send();
    }
    
    addressbook.removeContact(contactId);
    
    return res.status(200).send();
});

module.exports = router;
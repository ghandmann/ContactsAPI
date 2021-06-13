var express = require('express');
var router = express.Router();

const Addressbook = require("../../lib/addressbook");
const Contact = require("../../lib/contact");

const addressbookInstance = new Addressbook();


router.get("/api/v1/contacts", (req, res) => {
    const contactsList = addressbookInstance.contacts;
    res.send(contactsList);
});

router.post("/api/v1/contacts", (req, res) => {
    const {firstname, lastname, birthdate } = req.body;
    let newContact;
    try {
        newContact = new Contact(firstname, lastname, birthdate);
    }
    catch(error) {
        // Looks like an invalid contact, respond with 400 Bad Request
        return res.status(400).send();
    }
    
    addressbookInstance.addContact(newContact);

    return res.status(200).send();
})

router.delete("/api/v1/contacts", (req, res) => {
    const {firstname, lastname} = req.body;

    const contactToDelete = new Contact(firstname, lastname);

    if(!addressbookInstance.contactExists(contactToDelete)) {
        return res.status(404).send();
    }
    
    addressbookInstance.removeContact(contactToDelete);
    
    return res.status(200).send();
});

module.exports = router;
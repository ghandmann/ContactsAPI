var { nanoid } = require('../../../lib/nanoid');
var express = require('express');
var router = express.Router();

const Addressbook = require("../../../lib/addressbook");

const addressbook = new Addressbook();

router.get("/phonenumbers/:contactId", (req, res) => {
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

router.post("/phonenumbers/:contactId", (req, res) => {
    const { phonenumber, category } = req.body;

    const newPhoneNumberId = nanoid();
    addressbook.addPhoneNumber(newPhoneNumberId, req.params.contactId, phonenumber, category);

    return res.status(200).send({ id: newPhoneNumberId });
});

router.delete("/phonenumbers/:contactId", (req, res) => {
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
});

module.exports = router;
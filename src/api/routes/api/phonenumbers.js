var { nanoid } = require('../../../lib/nanoid');
const { PhonenumberAlreadyExistsError } = require('../../../lib/customErrors');

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

    try {
        const newPhoneNumberId = nanoid();
        addressbook.addPhoneNumber(newPhoneNumberId, req.params.contactId, phonenumber, category);
    
        return res.status(200).send({ id: newPhoneNumberId });
    }
    catch(error) {
        if(error instanceof PhonenumberAlreadyExistsError) {
            return res.status(409).send(error.message);
        }

        throw error;
    }
});

router.delete("/phonenumbers/:contactId", (req, res) => {
    const { phonenumberId } = req.body;

    try {
        addressbook.deletePhoneNumber(req.params.contactId, phonenumberId);
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
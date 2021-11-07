var { nanoid } = require('../../../lib/nanoid');
const { EmailaddressAlreadyExistsError } = require('../../../lib/customErrors');

var express = require('express');
var router = express.Router();

const Addressbook = require("../../../lib/addressbook");

const addressbook = new Addressbook();

router.get("/emailaddresses/:contactId", (req, res) => {
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

router.post("/emailaddresses/:contactId", (req, res) => {
    const { emailaddress, category } = req.body;

    try {
        const newEmailAddressId = nanoid();
        addressbook.addEmailAddress(newEmailAddressId, req.params.contactId, emailaddress, category);
    
        return res.status(200).send({ id: newEmailAddressId });
    }
    catch(error) {
        if(error instanceof EmailaddressAlreadyExistsError) {
            return res.status(409).send(error.message);
        }

        throw error;
    }
});

router.delete("/emailaddresses/:contactId", (req, res) => {
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
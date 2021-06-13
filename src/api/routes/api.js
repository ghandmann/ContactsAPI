var express = require('express');
var router = express.Router();


router.get("/api/v1/contacts", (req, res) => {
    const contactsList = [];
    res.send(contactsList);
});

router.post("/api/v1/contacts", (req, res) => {
    return res.send("create a new contact");
})

router.delete("/api/v1/contact", (req, res) => {
    return res.send("delete a contact");
});

module.exports = router;
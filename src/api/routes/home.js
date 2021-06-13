var express = require('express');
var router = express.Router();


router.get("/", (req, res) => {
    res.send("Die ContactsAPI bietet lediglich eine REST Full API an.");
});

module.exports = router;
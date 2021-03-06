var express = require('express');
var router = express.Router();

router.get("/version", (req, res) => {
    var fs = require('fs');
    var path = require('path');
    var appDir = path.dirname(require.main.filename);

    var versionFile = path.join(appDir, "../", "VERSION");

    res.type("txt");

    fs.access(versionFile, (err) => {
        if(err) {
            res.send("UNKNOWN-VERSION")
        }
        else {
            fs.readFile(versionFile, (err, data) => {
                if(err) {
                    res.send("UNKNOWN-VERSION")
                }
                else {
                    res.send(data.toString());
                }

            })
        }
    })
});

module.exports = router;
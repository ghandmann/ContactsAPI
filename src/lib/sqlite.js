const Database = require('better-sqlite3');
const { readFileSync } = require('fs');


let db = new Database();

if(process.env.NODE_ENV === "test") {
    db = new Database(":memory:");
    const dbSchema = readFileSync('./schema.sql');

    db.exec(dbSchema.toString());
}
else {
    console.log("CURRENT CWD=" + process.cwd());
    db = new Database('contacts.db', { fileMustExist: true });
}


module.exports = db;
CREATE TABLE IF NOT EXISTS "contacts" (
    id TEXT NOT NULL PRIMARY KEY,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    nickname TEXT,
    birthdate DATE
);

CREATE TABLE IF NOT EXISTS "phonenumbers" (
    id TEXT NOT NULL PRIMARY KEY,
    phonenumber TEXT NOT NULL,
    category TEXT,

    contactId TEXT NOT NULL,
    FOREIGN KEY (contactId) REFERENCES contacts(id)
);

CREATE TABLE IF NOT EXISTS "emailaddresses" (
    id TEXT NOT NULL PRIMARY KEY,
    emailaddress TEXT NOT NULL,
    category TEXT,

    contactId TEXT NOT NULL,
    FOREIGN KEY (contactId) REFERENCES contacts(id)
);
CREATE TABLE IF NOT EXISTS "contacts" (
    id INTEGER NOT NULL PRIMARY KEY,
    firstname TEXT NOT NULL,
    lastname TEXT,
    nickname TEXT,
    birthdate DATE
);

CREATE TABLE IF NOT EXISTS "phonenumbers" (
    id INTEGER NOT NULL PRIMARY KEY,
    phonenumber TEXT NOT NULL,
    category TEXT,

    contactId INTEGER NOT NULL,
    FOREIGN KEY (contactId) REFERENCES contacts(id)
);

CREATE TABLE IF NOT EXISTS "emailaddresses" (
    id INTEGER NOT NULL PRIMARY KEY,
    email TEXT NOT NULL,
    category TEXT,

    contactId INTEGER NOT NULL,
    FOREIGN KEY (contactId) REFERENCES contacts(id)
);
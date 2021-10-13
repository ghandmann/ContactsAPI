const Contact = require("../src/lib/contact");
const assert = require("assert");
const { nanoid } = require('../src/lib/nanoid');

describe("Contact Class", () => {
    describe("constructor", () => {
        it("work with firstname and lastname", () => {
            const newId = nanoid();
            const newContact = new Contact(newId, "John", "Doe", "Nickname", "1990-01-01");

            assert.strictEqual(newContact.id, newId);
            assert.strictEqual(newContact.firstname, "John");
            assert.strictEqual(newContact.lastname, "Doe");
            assert.strictEqual(newContact.nickname, "Nickname");
            assert.strictEqual(newContact.birthdate, "1990-01-01");
        });

        it("throws on missing everything", () => assert.throws(() => new Contact()));

        it("throws on missing firstname", () => assert.throws(() => new Contact(nanoid())));
        it("throws on missing lastname", () => assert.throws(() => new Contact(nanoid(), "FirstName")));

        it("throws on empty firstname", () => assert.throws(() => new Contact(nanoid(), "", "LastName")));
        it("throws on empty lastname", () => assert.throws(() => new Contact(nanoid(), "FirstName","")));

        it("throws on undefined firstname", () => assert.throws(() => new Contact(nanoid(), undefined, "LastName")));
        it("throws on undefined lastname", () => assert.throws(() => new Contact(nanoid(), "FirstName", undefined)));
    });
});
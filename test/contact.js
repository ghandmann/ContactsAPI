const Contact = require("../src/lib/contact");
const assert = require("assert");

describe("Contact Class", () => {
    describe("constructor", () => {
        it("work with firstname and lastname", () => {
            const newContact = new Contact("John", "Doe");

            assert.strictEqual(newContact.firstName, "John");
            assert.strictEqual(newContact.lastName, "Doe");
        });

        it("throws on missing firstname", () => assert.throws(() => new Contact()));
        it("throws on missing lastname", () => assert.throws(() => new Contact("FirstName")));

        it("throws on empty firstname", () => assert.throws(() => new Contact("", "LastName")));
        it("throws on empty lastname", () => assert.throws(() => new Contact("FirstName","")));

        it("throws on undefined firstname", () => assert.throws(() => new Contact(undefined, "LastName")));
        it("throws on undefined lastname", () => assert.throws(() => new Contact("FirstName", undefined)));
    });
    describe("getIdentifier", () => {
        it("should return the concatenated lastname and firstname", () => {
            const contact = new Contact("FirstName", "LastName");

            const actualIdentifier = contact.getIdentifier();

            const expectedIdentifier = "LastNameFirstName";

            assert.strictEqual(actualIdentifier, expectedIdentifier);
        })
    })
});
const assert = require('assert');
const Addressbook = require('../src/lib/addressbook');
const Contact = require('../src/lib/contact');
const { nanoid } = require('../src/lib/nanoid');

function buildRandomContact() {
  return new Contact(nanoid(), "FirstName-" + nanoid(), "Lastname", "Nickname", "1990-01-01");
}

const addressbook = new Addressbook();

describe('Addressbook Class', function() {
  describe('can add contacts', function() {
    it('should add the contact if the addressbook is empty', function() {
      const testContact = buildRandomContact();
      addressbook.addContact(testContact);

      const contactAdded = addressbook.contactExists(testContact.id);
      assert.strictEqual(contactAdded, true);
    });

    it('should throw an exception if the contact already exists', () => {
      const testContract = buildRandomContact();
      addressbook.addContact(testContract);
      assert.throws(() => addressbook.addContact(testContract));
    });
  });

  describe("can remove contacts", () => {
    it("should remove an existing contact", () => {
      const testContact = buildRandomContact();

      addressbook.addContact(testContact);

      const existsAfterCreate = addressbook.contactExists(testContact.id);
      assert.strictEqual(existsAfterCreate, true);

      addressbook.removeContact(testContact.id);

      const existsAfterDelete = addressbook.contactExists(testContact.id);
      assert.strictEqual(existsAfterDelete, false);
    })

    it("should throw on unknown contacts", () => {
      var unknownContact = buildRandomContact();
      assert.throws(() => addressbook.removeContact(unknownContact));
    })
  })
});

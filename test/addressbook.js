const assert = require('assert');
const Addressbook = require('../src/lib/addressbook');
const Contact = require('../src/lib/contact');
const { nanoid } = require('../src/lib/nanoid');

const dummyContact = new Contact(nanoid(), "Dummy FirstName", "Dummy LastName", "nickname", "1990-01-01");
describe('Addressbook Class', function() {
  let addressbook;
  beforeEach(() => {
    addressbook = new Addressbook();
  });

  describe('can add contacts', function() {
    it('should add the contact if the addressbook is empty', function() {
      addressbook.addContact(dummyContact);
    });

    it('should throw an exception if the contact already exists', () => {
      addressbook.addContact(dummyContact);
      assert.throws(() => addressbook.addContact(dummyContact));
    });
  });

  describe('has a assertIsContactObject method', () => {
    it("should not throw on valid Contact objects", () => {
      assert.doesNotThrow(() => addressbook.assertIsContactObject(dummyContact));
    });
    it("should throw on other objects and types", () => {
      assert.throws(() => addressbook.assertIsContactObject(undefined));
      assert.throws(() => addressbook.assertIsContactObject(null));
      assert.throws(() => addressbook.assertIsContactObject("someString"));
      assert.throws(() => addressbook.assertIsContactObject(1));
      assert.throws(() => addressbook.assertIsContactObject({}));
      assert.throws(() => addressbook.assertIsContactObject({"some": "object"}));
      assert.throws(() => addressbook.assertIsContactObject([]));
      assert.throws(() => addressbook.assertIsContactObject([1,2,3,4]));
    })
  });
  describe("can remove contacts", () => {
    it("should remove an existing contact", () => {
      addressbook.addContact(dummyContact);
      assert.strictEqual(addressbook.contacts.length, 1);

      addressbook.removeContact(dummyContact);
      assert.strictEqual(addressbook.contacts.length, 0);
    })

    it("should throw on unknown contacts", () => {
      var unknownContact = new Contact("Not tracked", "by addressbook");
      assert.throws(() => addressbook.removeContact(unknownContact));
    })
  })
});

const assert = require('assert');
const Addressbook = require('../addressbook');
const Contact = require('../contact');

const dummyContact = new Contact("dummy", "dummy");
describe('An addressbook', function() {
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
});

class Contact {
    firstName = undefined;
    lastName = undefined;
    birthDate = undefined;
    phoneNumbers = [];
    emailAddresses = [];

    constructor(firstName, lastName, birthDate) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = birthDate;

        this.validate();
    }

    validate() {
        let assertIsNotUndefinedNullOrEmpty = (data, fieldName) => {
            var isNullUndefinedOrEmpty = data === undefined || data === null || data === "";
            if(isNullUndefinedOrEmpty) {
                throw new Error(`${fieldName} may not be undefined, null or empty`);
            }
        }

        assertIsNotUndefinedNullOrEmpty(this.firstName, "firstName");
        assertIsNotUndefinedNullOrEmpty(this.lastName, "lastName");
    }

    fullName() {
        return this.lastName + ", " + this.firstName;
    }

    /*
     * Returns a string to identify this contact object
     * @returns string
     */
    getIdentifier() {
        return this.lastName + this.firstName;
    }
}

module.exports = Contact;
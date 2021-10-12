class Contact {
    constructor(id, firstName, lastName, nickName, birthDate) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.nickName = nickName;
        this.birthDate = birthDate;

        this.validate();
    }

    validate() {
        const assertIsNotUndefinedNullOrEmpty = (data, fieldName) => {
            var isNullUndefinedOrEmpty = data === undefined || data === null || data === "";
            if(isNullUndefinedOrEmpty) {
                throw new Error(`${fieldName} may not be undefined, null or empty`);
            }
        }

        assertIsNotUndefinedNullOrEmpty(this.id, "id");
        assertIsNotUndefinedNullOrEmpty(this.firstName, "firstName");
        assertIsNotUndefinedNullOrEmpty(this.lastName, "lastName");
    }

    fullName() {
        return this.lastName + ", " + this.firstName;
    }
}

module.exports = Contact;
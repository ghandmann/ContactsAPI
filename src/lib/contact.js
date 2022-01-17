class Contact {
    constructor(id, firstName, lastName, nickName, birthDate) {
        this.id = id;
        this.firstname = firstName;
        this.lastname = lastName;
        this.nickname = nickName;
        this.birthdate = birthDate;

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
        assertIsNotUndefinedNullOrEmpty(this.firstname, "firstName");
        assertIsNotUndefinedNullOrEmpty(this.lastname, "lastName");
    }

    fullName(useLessParam) {
        return this.lastname + ", " + this.firstname;
    }
}

module.exports = Contact;
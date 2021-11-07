class ContactAlreadyExistsError extends Error {
    constructor(firstname, lastname) {
        super(`There is alreay a contact with firstname='${firstname}' and lastname='${lastname}`);
    }
}

class PhonenumberAlreadyExistsError extends Error {
    constructor(phonenumber, contactId) {
        super(`The phonenumber='${phonenumber}' is already assigned to contactId='${contactId}`);
    }
}

class EmailaddressAlreadyExistsError extends Error {
    constructor(emailaddress, contactId) {
        super(`The emailaddress='${emailaddress}' is already assigned to contactId='${contactId}`);
    }
}


module.exports = {
    ContactAlreadyExistsError,
    PhonenumberAlreadyExistsError,
    EmailaddressAlreadyExistsError,
};
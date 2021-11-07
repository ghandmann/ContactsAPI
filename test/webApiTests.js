// Import the dependencies for testing
// const { should } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../src/api/app");
const db = require("../src/lib/sqlite");

// Configure chai
chai.use(chaiHttp);
var should = chai.should();

describe("contacts API", () => {
    describe("GET /api/v1/contacts Endpoint", () => {
        it("should return 200 ok", async () => {
            var res = await chai.request(app).get("/api/v1/contacts");
            res.should.have.status(200);
        })

        it("should return an empty array", async () => {
            // Make sure there are no entries in the database, otherwise this test will fail!
            db.prepare("DELETE FROM contacts").run();

            var res = await chai.request(app).get("/api/v1/contacts");
            res.body.should.be.an("array");
            res.body.should.have.length(0);
        })
    })

    describe("POST /api/v1/contacts Endpoint", () => {
        it("should add a new contact", async () => {
            const firstName = "John";
            const lastName = "Doe-" + Math.random() * 10000;
            const nickName = "J.D.";

            var createContactRes = await chai.request(app)
                .post("/api/v1/contacts")
                .send({ firstname: firstName, lastname: lastName, birthdate: "1990-01-01", nickname: nickName })
            
            createContactRes.should.have.status(200);
            
            var listContactsRes = await chai.request(app)
                .get("/api/v1/contacts")

            listContactsRes.body.should.be.an("array");

            const found = listContactsRes.body.find(candidate => candidate.firstname === firstName && candidate.lastname === lastName);
            found.should.not.to.be.undefined;
        })

        it("should return 400 on invalid contact", async () => {
            const createContactRes = await chai.request(app)
                .post("/api/v1/contacts")
                .send({ firstname: null, lastname: null });
            
            createContactRes.should.have.status(400);
        })
    })

    describe("DELETE /api/v1/contacts Endpoint", () => {
        it("should delete an existing contact", async () => {
            const firstname = "John";
            const lastname = "Doe-" + (Math.random() * 10000).toFixed(0);

            // Create a new Contact
            const createContactRes = await chai.request(app)
                .post("/api/v1/contacts")
                .send({ firstname, lastname });

            createContactRes.should.have.status(200);
            
            // Check the Contact got created
            const contactCreatedRes = await chai.request(app)
                .get("/api/v1/contacts");
            
            let found = contactCreatedRes.body.find(candidate => candidate.firstname === firstname && candidate.lastname === lastname);
            found.should.to.be.an("object");
            found.should.to.have.property("id");
            
            // Delete the newly crated Contact
            const contactDeletedRes = await chai.request(app)
                .delete("/api/v1/contacts")
                .send({ contactId: found.id });

            contactDeletedRes.should.have.status(200);
            
            // Check that the contact is not there anymore
            const contactListingRes = await chai.request(app)
                .get("/api/v1/contacts");

            found = contactListingRes.body.find(candidate => candidate.firstname === firstname && candidate.lastname === lastname);
            should.not.exist(found);
        })

        it("should return 404 on non existing contact", async () => {
            const deleteResponse = await chai.request(app)
                .delete("/api/v1/contacts")
                .send({ firstname: "Not tracked", lastname: "by Addressbook"});
            
            deleteResponse.should.have.status(404);
        });
    })
});

describe("phonenumbers API", () => {
    it("should return 404 on invalid contactId", async () => {
        const nonExistingContactId = "some-non-existing-contact-id";
        var res = await chai.request(app).get("/api/v1/phonenumbers/" + nonExistingContactId);
        res.should.have.status(404);
    });

    it("should return 404 when deleting a non existing phonenumber", async () => {
        const nonExistingContactId = "non-existing-contact-id";
        const nonExistingPhoneNumberId = "non-existing-phonenumber-id";

        const deleteResponse = await chai.request(app).delete("/api/v1/phonenumbers/" + nonExistingContactId).send({ id: nonExistingPhoneNumberId });

        deleteResponse.should.have.status(404);
    });

    describe("with an existing contact", () => {
        let contactId;
        let testEndpointUrl;
        beforeEach(async () => {
            contactId = await createRandomContact();
            contactId.should.not.be.null;

            testEndpointUrl = `/api/v1/phonenumbers/${contactId}/`;
        });
        
        it("should return empty list for contact without phonenumbers", async () => {
            var res = await chai.request(app).get(testEndpointUrl);

            res.should.have.status(200);
            res.body.should.be.a("array");
            res.body.should.have.length(0);
        });

        it("should add new phonenumbers", async () => {
            const addResponse = await chai.request(app).post(testEndpointUrl).send({ phonenumber: "1234", category: "default" });

            addResponse.should.have.status(200);
            addResponse.body.should.be.a("object");
            addResponse.body.should.have.property("id");

            const newPhoneNumberId = addResponse.body.id;

            const listResponse = await chai.request(app).get(testEndpointUrl);

            listResponse.should.have.status(200);
            listResponse.body.should.be.an("array");
            listResponse.body.should.have.length(1);

            const phonenumberObject = listResponse.body[0];

            phonenumberObject.phonenumber.should.equal("1234");
            phonenumberObject.category.should.equal("default");
            phonenumberObject.id.should.equal(newPhoneNumberId);
        });

        it("should delete phonenumbers", async () => {
            const addResponse = await chai.request(app).post(testEndpointUrl).send({ phonenumber: "1234", category: "default" });

            addResponse.should.have.status(200);

            const phonenumberId = addResponse.body.id;

            const deleteResponse = await chai.request(app).delete(testEndpointUrl).send({ id: phonenumberId });

            deleteResponse.should.have.status(200);
        });
    });
});

describe("emailaddresses API", () => {
    describe("listing emailaddresses for a contactId", () => {
        it("should return 404 on invalid contactId", async () => {
            const nonExistingContactId = "some-non-existing-contact-id";
            var res = await chai.request(app).get("/api/v1/emailaddresses/" + nonExistingContactId);
            res.should.have.status(404);
        });

        it("should return 404 when deleting a non existing phonenumber", async () => {
            const nonExistingContactId = "non-existing-contact-id";
            const nonExistingEmailAddressId = "non-existing-emailaddress-id";

            const deleteResponse = await chai.request(app).delete("/api/v1/emailaddresses/" + nonExistingContactId).send({ id: nonExistingEmailAddressId });

            deleteResponse.should.have.status(404);
        });

        describe("with an existing contact", () => {
            let contactId;
            let testEndpointUrl;
            beforeEach(async () => {
                contactId = await createRandomContact();
                contactId.should.not.be.null;
    
                testEndpointUrl = `/api/v1/emailaddresses/${contactId}/`;
            });
            
            it("should return empty list for contact without emailaddresses", async () => {
                var res = await chai.request(app).get(testEndpointUrl);
    
                res.should.have.status(200);
                res.body.should.be.a("array");
                res.body.should.have.length(0);
            });
    
            it("should add new emailaddresses", async () => {
                const addResponse = await chai.request(app).post(testEndpointUrl).send({ emailaddress: "someone@something.com", category: "default" });
    
                addResponse.should.have.status(200);
                addResponse.body.should.be.a("object");
                addResponse.body.should.have.property("id");
    
                const newEmailAddressId = addResponse.body.id;
    
                const listResponse = await chai.request(app).get(testEndpointUrl);
    
                listResponse.should.have.status(200);
                listResponse.body.should.be.an("array");
                listResponse.body.should.have.length(1);
    
                const emailAddressObject = listResponse.body[0];
    
                emailAddressObject.emailaddress.should.equal("someone@something.com");
                emailAddressObject.category.should.equal("default");
                emailAddressObject.id.should.equal(newEmailAddressId);
            });
    
            it("should delete emailaddresses", async () => {
                const addResponse = await chai.request(app).post(testEndpointUrl).send({ emailaddress: "someone@something.com", category: "default" });
    
                addResponse.should.have.status(200);
                addResponse.body.should.have.property("id");
    
                const emailaddressId = addResponse.body.id;
    
                const deleteResponse = await chai.request(app).delete(testEndpointUrl).send({ id: emailaddressId });
    
                deleteResponse.should.have.status(200);
            });
        });
    });
});

async function createRandomContact() {
    var create = await chai.request(app).post("/api/v1/contacts").send({ firstname: "testing" + Math.random(), lastname: "testing" + Math.random(), nickname: "testing", birthdate: "1990-01-01"});

    return create.body.id;
}
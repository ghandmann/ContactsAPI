// Import the dependencies for testing
const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../src/api/app");

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("ContactsAPI", () => {
    describe("GET /api/v1/contacts Endpoint", () => {
        it("should return 200 ok", async () => {
            var res = await chai.request(app).get("/api/v1/contacts");
            res.should.have.status(200);
        })

        it("should return an empty array", async () => {
            var res = await chai.request(app).get("/api/v1/contacts");
            res.body.should.be.an("array");
        })
    })

    describe("POST /api/v1/contacts Endpoint", () => {
        it("should add a new contact", async () => {
            const firstName = "John";
            const lastName = "Doe-" + Math.random() * 10000;

            var createContactRes = await chai.request(app)
                .post("/api/v1/contacts")
                .send({ firstname: firstName, lastname: lastName, birthdate: "1990-01-01" })
            
            createContactRes.should.have.status(200);
            
            var listContactsRes = await chai.request(app)
                .get("/api/v1/contacts")

            listContactsRes.body.should.be.an("array");

            const found = listContactsRes.body.find(candidate => candidate.firstName === firstName && candidate.lastName === lastName);
            expect(found).not.to.be.undefined;
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
            
            let found = contactCreatedRes.body.find(candidate => candidate.firstName === firstname && candidate.lastName === lastname);
            expect(found).to.be.an("object");
            
            // Delete the newly crated Contact
            const contactDeletedRes = await chai.request(app)
                .delete("/api/v1/contacts")
                .send({ firstname, lastname });

            contactDeletedRes.should.have.status(200);
            
            // Check that the contact is not there anymore
            const contactListingRes = await chai.request(app)
                .get("/api/v1/contacts");

            found = contactListingRes.body.find(candidate => candidate.firstName === firstname && candidate.lastName === lastname);
            expect(found).to.be.undefined;
        })

        it("should return 404 on non existing contact", async () => {
            const deleteResponse = await chai.request(app)
                .delete("/api/v1/contacts")
                .send({ firstname: "Not tracked", lastname: "by Addressbook"});
            
            deleteResponse.should.have.status(404);
            
        })
    })
})
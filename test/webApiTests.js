// Import the dependencies for testing
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../src/api/app");

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("ContactsAPI", () => {
    describe("GET /api/v1/contacts Endpoint", () => {
        it("should return 200 ok", (done) => {
            chai.request(app).get("/api/v1/contacts").end((err, res) => {
                res.body.should.be.a("array");
                done();
            })
        })

        it("should return an empty array", (done) => {
            chai.request(app).get("/api/v1/contacts").end((err, res) => {
                res.body.should.be.an("array").and.be.empty;
                done();
            })
        })
    })

    describe("POST /api/v1/contacts Endpoint", () => {

    })

    describe("DELETE /api/v1/contacts Endpoint", () => {

    })
})
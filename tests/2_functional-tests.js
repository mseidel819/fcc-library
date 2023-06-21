/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  // test("#example Test GET /api/books", function (done) {
  //   chai
  //     .request(server)
  //     .get("/api/books")
  //     .end(function (err, res) {
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, "response should be an array");

  //       if (res.body.length > 0) {
  //         assert.property(
  //           res.body[0],
  //           "commentcount",
  //           "Books in array should contain commentcount"
  //         );
  //         assert.property(
  //           res.body[0],
  //           "title",
  //           "Books in array should contain title"
  //         );
  //         assert.property(
  //           res.body[0],
  //           "_id",
  //           "Books in array should contain _id"
  //         );
  //       }
  //       done();
  //     });
  // });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function () {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "test" })
            .end(function (err, res) {
              assert.equal(res.status, 200);

              chai.expect(res.body).to.be.an("object");
              chai.expect(res.body).to.have.property("_id");
              chai.expect(res.body).to.have.property("title");
              chai.expect(res.body.title).to.equal("test");
              chai.expect(res.body).to.have.property("comments");
              chai.expect(res.body.comments).to.be.an("array");

              //delete the book
              chai
                .request(server)
                .delete("/api/books/" + res.body._id)
                .end(function (err, res) {
                  done();
                });
            });
        });

        test("Test POST /api/books with no title given", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "" })
            .end(function (err, res) {
              assert.equal(res.text, "missing required field title");

              // chai.expect(res.text).to.equal("missing required field title");

              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end(function (err, res) {
            chai.expect(res).to.have.status(200);
            if (res.body.length > 0) {
              assert.isArray(res.body, "response should be an array");
              // chai.expect(res.body).to.be.an("array");
              chai.expect(res.body[0]).to.have.property("_id");
              chai.expect(res.body[0]).to.have.property("title");
              chai.expect(res.body[0]).to.have.property("commentcount");
            } else {
              chai.expect(res.body).to.be.an("array");
            }
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .get("/api/books/123")
          .end(function (err, res) {
            assert.equal(res.text, "no book exists");
            chai.expect(res.text).to.equal("no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .post("/api/books")
          .send({ title: "test_with_id" })
          .end(function (err, res) {
            chai.expect(res).to.have.status(200);

            chai
              .request(server)
              .get("/api/books/" + res.body._id)
              .end(function (err, res) {
                assert.equal(res.status, 200);
                chai.expect(res.body).to.be.an("object");
                chai.expect(res.body).to.have.property("_id");
                chai.expect(res.body).to.have.property("title");

                //delete the book
                chai
                  .request(server)
                  .delete("/api/books/" + res.body._id)
                  .end(function (err, res) {
                    done();
                  });
              });
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "test_add_comment" })
            .end(function (err, res) {
              chai.expect(res).to.have.status(200);

              chai
                .request(server)
                .post("/api/books/" + res.body._id)
                .send({ comment: "test_comment" })
                .end(function (err, res) {
                  assert.equal(res.status, 200);
                  chai.expect(res.body).to.be.an("object");
                  chai.expect(res.body).to.have.property("_id");
                  chai.expect(res.body.comments).to.be.an("array");
                  chai.expect(res.body.comments[0]).to.equal("test_comment");

                  //delete the book
                  chai
                    .request(server)
                    .delete("/api/books/" + res.body._id)
                    .end(function (err, res) {
                      done();
                    });
                });
            });
        });

        test("Test POST /api/books/[id] without comment field", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "test_add_comment" })
            .end(function (err, res) {
              chai.expect(res).to.have.status(200);

              chai
                .request(server)
                .post("/api/books/" + res.body._id)
                .send({ comment: "" })
                .end(function (err, res) {
                  assert.equal(res.text, "missing required field comment");
                  // chai
                  //   .expect(res.text)
                  //   .to.equal("missing required field comment");

                  //delete the book
                  chai
                    .request(server)
                    .delete("/api/books/" + res.body._id)
                    .end(function (err, res) {
                      done();
                    });
                });
            });
        });

        test("Test POST /api/books/[id] with comment, id not in db", function (done) {
          chai
            .request(server)
            .post("/api/books/123")
            .send({ comment: "test_comment" })
            .end(function (err, res) {
              assert.equal(res.text, "no book exists");
              // chai.expect(res.text).to.equal("no book exists");
              done();
            });
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .post("/api/books")
          .send({ title: "test_delete" })
          .end(function (err, res) {
            chai.expect(res).to.have.status(200);

            chai
              .request(server)
              .delete("/api/books/" + res.body._id)
              .end(function (err, res) {
                assert.equal(res.text, "delete successful");
                // chai.expect(res.text).to.equal("delete successful");
                done();
              });
          });
      });

      test("Test DELETE /api/books/[id] with  id not in db", function (done) {
        chai
          .request(server)
          .delete("/api/books/123")
          .end(function (err, res) {
            assert.equal(res.text, "no book exists");
            // chai.expect(res.text).to.equal("no book exists");
            done();
          });
      });
    });
  });
});

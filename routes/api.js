/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const Book = require("../library/library-model.js");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const book = await Book.find().select({ comments: 0, __v: 0 });

        res.status(200).json(book);
      } catch (err) {
        res.json({ error: err.message });
      }
    })

    .post(async function (req, res) {
      let title = req.body.title;

      try {
        //response will contain new book object including atleast _id and title
        if (!title) {
          return res.send("missing required field title");
        }
        const newBook = await Book.create({ title });

        res.status(200).json(newBook);
      } catch (err) {
        res.json({ error: err.message });
      }
    })

    .delete(async function (req, res) {
      //if successful response will be 'complete delete successful'
      try {
        const book = await Book.deleteMany();

        res.send("complete delete successful");
      } catch (err) {
        res.json({ error: err.message });
      }
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        const book = await Book.findById(bookid).select({
          __v: 0,
          commentcount: 0,
        });

        if (!book) {
          res.send("no book exists");
        } else res.status(200).json(book);
      } catch (err) {
        if (err.kind === "ObjectId") {
          return res.send("no book exists");
        } else res.json({ error: err.message });
      }
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      try {
        //find book by id and push comment to comments array

        if (!comment) {
          return res.send("missing required field comment");
        }

        const book = await Book.findByIdAndUpdate(
          bookid,
          { $push: { comments: comment }, $inc: { commentcount: 1 } },
          { new: true }
        ).select({ __v: 0, commentcount: 0 });

        if (!book) {
          res.send("no book exists");
        } else res.json(book);
      } catch (err) {
        if (err.kind === "ObjectId") {
          return res.send("no book exists");
        } else res.json({ error: err.message });
      }
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      try {
        const deletedBook = await Book.findByIdAndDelete(bookid);

        if (!deletedBook) {
          res.send("no book exists");
        } else {
          res.send("delete successful");
        }
      } catch (err) {
        if (err.kind === "ObjectId") {
          return res.send("no book exists");
        } else res.json({ error: err.message });
      }
    });
};

const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A book must have a title"],
    unique: true,
    trim: true,
    maxlength: [40, "A book title must have less or equal then 40 characters"],
    // minlength: [10, "A book title must have more or equal then 10 characters"],
  },
  comments: [String],
  commentcount: {
    type: Number,
    default: 0,
  },
});

const Book = mongoose.model("book", bookSchema);

module.exports = Book;

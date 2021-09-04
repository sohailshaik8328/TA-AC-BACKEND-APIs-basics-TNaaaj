let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let bookSchema = new Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    tags: [String],
    author: String,
    pages: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);

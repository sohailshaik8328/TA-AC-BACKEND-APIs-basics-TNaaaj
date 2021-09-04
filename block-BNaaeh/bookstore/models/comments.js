let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let commentSchema = new Schema(
  {
    comment: { type: String, required: true },
    author: String,
    bookId: { type: Schema.Types.ObjectId, ref: 'Newbook', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);

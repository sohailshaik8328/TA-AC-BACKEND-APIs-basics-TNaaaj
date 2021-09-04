let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let bookSchema = new Schema({
    title: {type: String, required: true},
    author: String,
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}],
    summary: {type: String, required: true},
    tags: [String],
    pages: Number
}, {timestamps: true});


module.exports = mongoose.model("Newbook", bookSchema);
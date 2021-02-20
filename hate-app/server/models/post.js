const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema for todo
const PostSchema = new Schema({
  author: String,
  comments: [{body: String, date: Date}],  
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  message: {
    type: String,
    required: [true, 'Message field is required']
  },
  meta: {
    votes: Number
  },
  

})

//create model for todo
const Post = mongoose.model('post', PostSchema);

module.exports = Post;
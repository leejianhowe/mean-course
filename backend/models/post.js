const mongoose = require("mongoose");

const {
  Schema
} = mongoose;

const postSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    default: 'Example Post Content'
  },
  date: {
    type: Date
  }

})

const Post = mongoose.model("Post", postSchema);

module.exports = Post;

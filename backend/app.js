const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb://localhost:27017/meanDB', {
  useNewUrlParser: true
}).then(() => {
  console.log("connected to DB")
}).catch(() => {
  console.log('connection fail')
});

/**to read POST request to parse json data*/
app.use(bodyParser.json());
/**to parse url encoded data */
app.use(bodyParser.urlencoded({
  extended: false
}));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    date: new Date()
  });
  // console.log(post);
  post.save().then(result => {
    console.log(result)
    res.status(201).json({
      message: "Post added successfully",
      postId: result._id
    });

  });


});

app.get('/api/posts', (req, res, next) => {
  Post.find().then(posts => {
    res.status(200).json({
      message: "Posts fetched",
      posts: posts
    });
    /**prints all posts in Post */
    // console.log(posts);
  })
  // let date = new Date;
  // const posts = [{
  //     id: 1,
  //     title: "first post",
  //     content: "first conten",
  //     date: date
  //   },
  //   {
  //     id: 2,
  //     title: "2nd post",
  //     content: "2nd content",
  //     date: date
  //   }
  // ]

});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id
  }).then(result => {
    console.log(result);
    console.log("Post with " + req.params.id + " has been deleted")
    res.status(200).json({
      message: "Post deleted",
    });
  })
})

/**to export the app  */
module.exports = app;

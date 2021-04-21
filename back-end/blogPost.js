const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

// Configure multer so that it will upload to '/public/images'
const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 50000000
  }
});

const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

const blogPostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  title: String,
  created: {
    type: Date,
    default: Date.now()
  },
  paragraphs: String,
  photoPath: String,
  numOfLikes: {
    type: Number,
    default: 0,
  }
});

blogPostSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
  });

blogPostSchema.set('toJSON', {
  virtuals: true
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

// upload a blog post
router.post('/', validUser, upload.single('photo'), async (req, res) => {
  if (!req.file) {
    console.log("Must upload a file");
    return res.status(400).send({
      message: "Must upload a file"
    });
  }
  if (req.user.role === "banned") {
    console.log("You are banned! You can't post!");
    return res.sendStatus(403);
  }
  let date = Date.now();
  if (req.body.created) {
    date = req.body.created;
  }

  const post = new BlogPost({
    user: req.user,
    photoPath: "/images/" + req.file.filename,
    title: req.body.title,
    created: date,
    paragraphs: req.body.paragraphs,
  });
  try {
    await post.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// Get posts for a single user
router.get("/", validUser, async (req, res) => {
  try {
    let posts = await BlogPost.find({
      user: req.user
    }).sort({
      created: -1
    }).populate('user');
    return res.send(posts);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// Get all posts for all users
router.get("/all", async (req, res) => {
  try {
    let posts = await BlogPost.find().sort({
      created: -1
    }).populate('user');
    res.send(posts);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    let post = await BlogPost.findOne({_id: req.params.id}).populate('user');
    return res.send(post);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// Increment the like counter
router.put("/like/:id", async (req, res) => {
  try {
    let post = await BlogPost.findOne({_id: req.params.id}).populate('user');
    post.numOfLikes += 1;
    await post.save();
    return res.send(post);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// Edit post
router.put("/:id", validUser, async (req, res) => {
  try {
    let post = await BlogPost.findOne({
      _id: req.params.id
    }).populate('user');
    if (post.user.id !== req.user.id && req.user.role !== 'admin') {
      console.log("Invalid user to edit this post");
      return res.sendStatus(403);
    }
    post.title = req.body.title;
    post.paragraphs = req.body.paragraphs;
    await post.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// Delete post
router.delete("/:id", validUser, async (req, res) => {
  try {
    let post = await BlogPost.findOne({
      _id: req.params.id
    }).populate('user');
    if (post.user.id !== req.user.id && req.user.role !== 'admin') {
      console.log("Invalid user to delete this post");
      return res.sendStatus(403);
    }
    await BlogPost.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = {
  model: BlogPost,
  routes: router,
}

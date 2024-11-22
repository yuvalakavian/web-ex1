const express = require('express');
const Post = require('../models/post');
const router = express.Router();

// Add a new post
router.post('/', async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all posts
// Optional: senderID filter
router.get('/', async (req, res) => {
  const senderID = req.query.sender;
  const filter = senderID ? { senderID } : {};
  const posts = await Post.find(filter);
  res.send(posts);
});

// Get post by ID
router.get('/:postsID', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postsID);
    if (!post) return res.status(404).send();
    res.send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a post
router.put('/:postsID', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.postsID, req.body, { new: true, runValidators: true });
    if (!post) return res.status(404).send();
    res.send(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;

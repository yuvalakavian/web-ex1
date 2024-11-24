const express = require('express');
const Comment = require('../models/comment');
const router = express.Router();

// Add a new comment
router.post('/', async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.status(201).send(comment);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all comments
router.get('/', async (req, res) => {
  const comments = await Comment.find();
  res.send(comments);
});

// Get comments by post ID
router.get('/post/:postsID', async (req, res) => {
  const comments = await Comment.find({ postsID: req.params.postsID });
  res.send(comments);
});

// Update a comment
router.put('/:commentID', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.commentID, req.body, { new: true, runValidators: true });
    if (!comment) return res.status(404).send();
    res.send(comment);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a comment
router.delete('/:commentID', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentID);
    if (!comment) return res.status(404).send();
    res.send(comment);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

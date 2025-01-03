const CommentModel = require('../models/comment');

// Add a new comment
const createComment = async (req, res) => {
  try {
    const comment = new CommentModel(req.body);
    await comment.save();
    res.status(201).send(comment);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all comments
const getAllComments =  async (req, res) => {
  const comments = await CommentModel.find();
  res.send(comments);
};

// Get comment by ID
const getCommentById =  async (req, res) => {
  try {
    const comment = await CommentModel.findById(req.params.id);
    if (!comment) return res.status(404).send();
    res.send(comment);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get comments by post ID
const getCommentByPostId = async (req, res) => {
  const comments = await CommentModel.find({ postsID: req.params.id });
  res.send(comments);
};

// Update a comment
const updateComment = async (req, res) => {
  try {
    const comment = await CommentModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!comment) return res.status(404).send();
    res.send(comment);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const comment = await CommentModel.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).send();
    res.send(comment);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
    createComment,
    getAllComments,
    getCommentById,
    getCommentByPostId,
    updateComment,
    deleteComment
  };
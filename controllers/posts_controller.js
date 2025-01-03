const PostModel = require("../models/post");

// Get all posts
// Optional: senderID filter
const getAllPosts = async (req, res) => {
  const filter = req.query.sender;
  try {
    if (filter) {
      const posts = await PostModel.find({ senderID: filter });
      res.send(posts);
    } else {
      const posts = await PostModel.find();
      res.send(posts);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Get post by ID
const getPostById = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) return res.status(404).send();
    res.send(post);
  } catch (error) {
    res.status(500).send(error);
  }
};


// Add a new post
const createPost = async (req, res) => {
  try {
    const post = new PostModel(req.body);
    await post.save();
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Update a post
const updatePost = async (req, res) => {
  try {
    const post = await PostModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!post) return res.status(404).send();
    res.send(post);
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost
};

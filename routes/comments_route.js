const express = require('express');
const router = express.Router();
const commentsController = require("../controllers/comments_controller");

router.post("/", commentsController.createComment);

router.get("/", commentsController.getAllComments);

router.get("/:id", commentsController.getCommentById);

router.get("/post/:id", commentsController.getCommentByPostId);

router.put("/:id", commentsController.updateComment);

router.delete("/:id", commentsController.deleteComment);

module.exports = router;

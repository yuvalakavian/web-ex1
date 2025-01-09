import express from "express";
const router = express.Router();
import commentsController from "../controllers/comments_controller";
import { authMiddleware } from "../controllers/auth_controller";

router.get("/",authMiddleware, commentsController.getAll.bind(commentsController));

router.get("/:id",authMiddleware, commentsController.getById.bind(commentsController));

router.get("/post/:id", authMiddleware, commentsController.getCommentsByPostId.bind(commentsController))

router.post("/", authMiddleware, commentsController.create.bind(commentsController));

router.put("/:id",authMiddleware, commentsController.updateItem.bind(commentsController));

router.delete("/:id",authMiddleware, commentsController.deleteItem.bind(commentsController));

export default router;

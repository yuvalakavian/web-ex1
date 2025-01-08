import express from "express";
const router = express.Router();
import commentsController from "../controllers/comments_controller";

router.post("/", commentsController.create.bind(commentsController));

router.get("/", commentsController.getAll.bind(commentsController));

router.get("/:id", commentsController.getById.bind(commentsController));

router.put("/:id", commentsController.updateItem.bind(commentsController));

router.delete("/:id", commentsController.deleteItem.bind(commentsController));

export default router;

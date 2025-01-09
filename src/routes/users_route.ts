import express from "express";
const router = express.Router();
import usersController from "../controllers/users_controller";
import { authMiddleware } from "../controllers/auth_controller";

router.get("/", authMiddleware, usersController.getAll.bind(usersController));

router.get("/:id", authMiddleware, usersController.getById.bind(usersController));

router.post("/", authMiddleware, usersController.create.bind(usersController));

router.put("/:id", authMiddleware, usersController.updateItem.bind(usersController));

router.delete("/:id", authMiddleware, usersController.deleteItem.bind(usersController));

export default router;

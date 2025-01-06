import express from "express";
const router = express.Router();
import usersController from "../controllers/users_controller";

router.get("/", usersController.getAll.bind(usersController));

router.get("/:id", usersController.getById.bind(usersController));

router.post("/", usersController.create.bind(usersController));

router.put("/:id", usersController.updateItem.bind(usersController));

router.delete("/:id", usersController.deleteItem.bind(usersController));

export default router;

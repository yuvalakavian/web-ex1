const express = require('express');
const router = express.Router();
const authController = require("../controllers/auth_controller");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/refresh", authController.refresh);

router.post("/logout", authController.logout);

export default router;

import express from "express";
const router = express.Router();
import postsController from "../controllers/posts_controller";
import { authMiddleware } from "../controllers/auth_controller";

/**
* @swagger
* tags:
*   name: Posts
*   description: The Posts API
*/

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all posts
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get("/", authMiddleware, postsController.getAll.bind(postsController));

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get a post by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The post object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found.
 */
router.get("/:id", authMiddleware, postsController.getById.bind(postsController));

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new post
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: Post created successfully.
 */
router.post("/", authMiddleware, postsController.create.bind(postsController));

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update a post
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Post updated successfully.
 *       404:
 *         description: Post not found.
 */
router.put("/:id", authMiddleware, postsController.updateItem.bind(postsController));

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a post
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully.
 *       404:
 *         description: Post not found.
 */
router.delete("/:id", authMiddleware, postsController.deleteItem.bind(postsController));

export default router;

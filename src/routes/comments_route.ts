import express from "express";
const router = express.Router();
import commentsController from "../controllers/comments_controller";
import { authMiddleware } from "../controllers/auth_controller";

/**
* @swagger
* tags:
*   name: Comments
*   description: The Comments API
*/

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all comments
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all comments.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */
router.get("/", authMiddleware, commentsController.getAll.bind(commentsController));

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get a comment by ID
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
 *         description: The comment object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found.
 */
router.get("/:id", authMiddleware, commentsController.getById.bind(commentsController));

/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: Get comments by post ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments for the post.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Post not found.
 */

/*TODO: implement this route
router.get("/post/:id", commentsController.getByPostId.bind(commentsController));
*/

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new comment
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: Comment created successfully.
 */
router.post("/", authMiddleware, commentsController.create.bind(commentsController));

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update a comment
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
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: Comment updated successfully.
 *       404:
 *         description: Comment not found.
 */
router.put("/:id", authMiddleware, commentsController.updateItem.bind(commentsController));

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a comment
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
 *         description: Comment deleted successfully.
 *       404:
 *         description: Comment not found.
 */
router.delete("/:id", authMiddleware, commentsController.deleteItem.bind(commentsController));

export default router;

import { Request, Response } from "express";
import commentsModel, { IComments } from "../models/comments_model";
import BaseController from "./base_controller";

// TODO: add Optional: post ID filter

class CommentsController extends BaseController<IComments> {
  constructor() {
    super(commentsModel);
  }

  async create(req: Request, res: Response) {
    const userId = req.params.userId;
    const post = {
      ...req.body,
      senderId: userId,
    };
    req.body = post;
    super.create(req, res);
  }

  async getCommentsByPostId(req: Request, res: Response) {
    const filter = req.params.id;
    try {
      if (filter) {
        const item = await this.model.find({ postId: filter });
        res.send(item);
      } else {
        const items = await this.model.find();
        res.send(items);
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

export default new CommentsController();

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

  async getAll(req: Request, res: Response) {
    const filtersSender = req.query.sender as string | undefined;
    const filtersPost = req.query.post as string | undefined;
    try {
      if (filtersSender || filtersPost) {
        const item = await this.model.find({ senderId: filtersSender, postId: filtersPost });
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

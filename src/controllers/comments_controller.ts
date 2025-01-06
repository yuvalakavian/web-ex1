import commentsModel, { IComments } from "../models/comment_model";
import BaseController from "./base_controller";

const commentsController = new BaseController<IComments>(commentsModel);

export default commentsController;

// TODO: add Optional: post ID filter

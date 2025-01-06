import postModel, { IPost } from "../models/post_model";
import BaseController from "./base_controller";

const postsController = new BaseController<IPost>(postModel);
export default postsController;

// TODO: add Optional: senderId filter

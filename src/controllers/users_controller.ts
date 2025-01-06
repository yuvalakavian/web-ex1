import userModel, { IUsres } from "../models/user_model";
import baseController from "./base_controller";

const usersController = new baseController<IUsres>(userModel);
export default usersController;

import userModel, { IUser } from "../models/users_model";
import baseController from "./base_controller";

const usersController = new baseController<IUser>(userModel);
export default usersController;

import { IController } from "../../../types";
import HandlerFunction from "../../../controllers/handler-function";
import AdminUpdateController from "@/controllers/auth/admin-update";
import TokenMiddleware from "@/controllers/middlewares/token";

const updateController: IController = new TokenMiddleware(
  new AdminUpdateController()
);
const handler = HandlerFunction(updateController);

export default handler;

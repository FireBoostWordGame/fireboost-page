import HandlerFunction from "@/controllers/handler-function";
import TokenMiddleware from "@/controllers/middlewares/token";
import UserController from "@/controllers/users";
import type { IController } from "@/types";

const userController: IController = new TokenMiddleware(new UserController());

const handler = HandlerFunction(userController);

export default handler;

import HandlerFunction from "@/controllers/handler-function";
import TokenMiddleware from "@/controllers/middlewares/token";
import RequestBoostController from "@/controllers/request-boost";
import { IController } from "@/types";

const requestBoostController: IController = new TokenMiddleware(
  new RequestBoostController(true)
);

const handler = HandlerFunction(requestBoostController);

export default handler;

import GamesController from "@/controllers/games";
import HandlerFunction from "@/controllers/handler-function";
import TokenMiddleware from "@/controllers/middlewares/token";
import { IController } from "@/types";

const gamesController: IController = new TokenMiddleware(
  new GamesController(false)
);

const handler = HandlerFunction(gamesController);

export default handler;

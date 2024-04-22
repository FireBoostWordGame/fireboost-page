import GamesController from "@/controllers/games";
import PositionsController from "@/controllers/games/positions";
import HandlerFunction from "@/controllers/handler-function";
import TokenMiddleware from "@/controllers/middlewares/token";
import { IController } from "@/types";

const gamesController: IController = new TokenMiddleware(
  new GamesController(true, new PositionsController(true))
);

const handler = HandlerFunction(gamesController);

export default handler;

import LoginController from "../../../controllers/auth/login";
import { IController } from "../../../types";
import HandlerFunction from "../../../controllers/handler-function";
import JWTService from "../../../services/token";
import ConfigService from "../../../utils/config/configService";

const loginController: IController = new LoginController(
  new JWTService(new ConfigService())
);
const handler = HandlerFunction(loginController);

export default handler;

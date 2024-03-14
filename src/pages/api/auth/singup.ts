import SingUpController from "@/controllers/auth/singup";
import HandlerFunction from "@/controllers/handler-function";
import type { IController } from "@/types";

const singUpController: IController = new SingUpController();
const handler = HandlerFunction(singUpController);

export default handler;

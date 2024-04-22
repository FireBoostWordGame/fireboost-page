import {
  ErrorEndpoint,
  InternalServerError,
  PrismaError,
} from "@/errorManager";
import type { ControllerMethod, HandlerFunctionApi } from "../types";
import Controller from "./controller";

// Function what recive controller and extract method and cast an call the function "run"
const HandlerFunction: HandlerFunctionApi<any> = (controller) => {
  return async (req, res) => {
    try {
      const method = req.method?.toUpperCase() as ControllerMethod | undefined;
      await controller.run(method, req, res);
      console.log("EEEEE");
    } catch (error: unknown) {
      console.log("Error");
      if (error instanceof ErrorEndpoint) {
        Controller.handleError(res, error);
      } else {
        if (error instanceof Error && error.name.includes("Prisma")) {
          Controller.handleError(
            res,
            new PrismaError(error.message, `Prisma Error In: ${error.name}`)
          );
        } else {
          Controller.handleError(res, new InternalServerError("Error Unknow"));
        }
      }
    }
  };
};

export default HandlerFunction;

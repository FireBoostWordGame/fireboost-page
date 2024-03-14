import type { ControllerMethod, HandlerFunctionApi } from "@/types";

// Function what recive controller and extract method and cast an call the function "run"
const HandlerFunction: HandlerFunctionApi<any> = (controller) => {
  return async (req, res) => {
    const method = req.method?.toUpperCase() as ControllerMethod | undefined;
    await controller.run(method, req, res);
  };
};

export default HandlerFunction;

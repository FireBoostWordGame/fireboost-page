import PrismaService from "@/services/prisma";
import type {
  ControllerFunction,
  ControllerMethod,
  IController,
  ResponseControllerNotFound,
} from "@/types";
import HttpStatusManagement from "@/utils/http-status-management";
import type { $Enums } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

// Controller Class Base
// The controller inherate the class PrismaService whit add all methods to query
export default abstract class Controller
  extends PrismaService
  implements IController
{
  // Http Status Management
  httpStatuses: HttpStatusManagement = new HttpStatusManagement();
  // We control access to each route according to the roll Enum
  accessTypeMethod: Record<ControllerMethod, $Enums.Role | null> = {
    GET: null,
    DELETE: null,
    PATCH: null,
    POST: null,
    PUT: null,
  };
  /*
    We register the methods for the endpoint response, 
    we only register one function per method "GET", "POST" etc., 
    due to the nextjs architecture
  */
  private methods: Record<ControllerMethod, ControllerFunction> = {
    GET: this.notFound,
    DELETE: this.notFound,
    PATCH: this.notFound,
    POST: this.notFound,
    PUT: this.notFound,
  };

  /*
    Function to Run Handle Request 
  */
  async run(
    mt: ControllerMethod | undefined,
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    try {
      if (mt === null || mt === undefined) mt = "GET";
      const fn = this.methods[mt];
      if (fn !== null || fn !== undefined) await fn(req, res);
    } catch (error) {
      const fn = this.methods.GET;
      await fn(req, res);
    }
  }

  // Functions to register functions according to him method
  protected addGet(fn: ControllerFunction): void {
    this.methods.GET = fn;
  }

  protected addDelete(fn: ControllerFunction): void {
    this.methods.DELETE = fn;
  }
  protected addPatch(fn: ControllerFunction): void {
    this.methods.PATCH = fn;
  }
  protected addPost(fn: ControllerFunction): void {
    this.methods.POST = fn;
  }
  protected addPut(fn: ControllerFunction): void {
    this.methods.PUT = fn;
  }

  // Funtions to response for method no implement
  private notFound(
    _: NextApiRequest,
    res: NextApiResponse<ResponseControllerNotFound>
  ): void {
    res.status(400).json({ error: "Method Not Found, Not Implement" });
  }
}

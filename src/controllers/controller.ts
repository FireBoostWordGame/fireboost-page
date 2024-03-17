import PrismaService from "@/services/prisma";
import {
  ErrorReturn,
  FunctionsMethods,
  HttpStatusKeysMore,
  type ControllerFunction,
  type ControllerMethod,
  type IController,
  type ResponseControllerNotFound,
} from "../types";
import HttpStatusManagement from "../utils/http-status-management";
import type { $Enums } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { ErrorEndpoint, InternalServerError } from "@/errorManager";
import { NoFoundError } from "@/errorManager/error-notfound";

// Controller Class Base
// The controller inherate the class PrismaService whit add all methods to query
export default abstract class Controller
  extends PrismaService
  implements IController
{
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
  private methods: Record<ControllerMethod, FunctionsMethods> = {
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
      // Verify to method send not is null or undefined
      if (mt === null || mt === undefined) mt = "GET";
      // Get data
      let fn = this.methods[mt];
      // Verify to Url not undifinde
      if (req.url !== undefined) {
        // Get last property of url
        const splits = req.url.split("/");
        const finishPathFormat = splits[splits.length - 1];
        // Verify what the data is the instance function
        if (fn instanceof Function) {
          if (fn !== null || fn !== undefined) await fn(req, res);
          // if the function is null or undefined send not found function
          else await this.notFound(req, res);
        } else {
          // Get the function in object
          const func = fn[finishPathFormat];
          // if the functions is undefined send the default function in object
          if (func === undefined || func === null) {
            await fn.defaultF(req, res);
          } else {
            // call function
            await func(req, res);
          }
        }
      } else {
        if (fn instanceof Function) {
          if (fn !== null || fn !== undefined) await fn(req, res);
          else await this.notFound(req, res);
        } else {
          await fn.defaultF(req, res);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  protected addGet(fn: ControllerFunction, keyPath?: string | undefined): void {
    // Verify the KeyPath not undefined
    if (keyPath !== undefined) {
      // Verify is function
      if (this.methods.GET instanceof Function) {
        // add this function to defaultMethod and add in the keypath the Function
        this.methods.GET = { defaultF: this.methods.GET, [keyPath]: fn };
      } else {
        this.methods.GET.defaultF = this.methods.GET.defaultF;
        this.methods.GET[keyPath] = fn;
      }
    } else {
      // Add function to single method object
      this.methods.GET = fn;
    }
  }

  protected addDelete(
    fn: ControllerFunction,
    keyPath?: string | undefined
  ): void {
    if (keyPath !== undefined) {
      if (this.methods.DELETE instanceof Function) {
        this.methods.DELETE = { defaultF: this.methods.DELETE, [keyPath]: fn };
      } else {
        this.methods.DELETE.defaultF = this.methods.DELETE.defaultF;
        this.methods.DELETE[keyPath] = fn;
      }
    } else {
      this.methods.DELETE = fn;
    }
  }

  protected addPatch(
    fn: ControllerFunction,
    keyPath?: string | undefined
  ): void {
    if (keyPath !== undefined) {
      if (this.methods.PATCH instanceof Function) {
        this.methods.PATCH = { defaultF: this.methods.PATCH, [keyPath]: fn };
      } else {
        this.methods.PATCH.defaultF = this.methods.PATCH.defaultF;
        this.methods.PATCH[keyPath] = fn;
      }
    } else {
      this.methods.PATCH = fn;
    }
  }

  protected addPost(
    fn: ControllerFunction,
    keyPath?: string | undefined
  ): void {
    if (keyPath !== undefined) {
      if (this.methods.POST instanceof Function) {
        this.methods.POST = { defaultF: this.methods.POST, [keyPath]: fn };
      } else {
        this.methods.POST.defaultF = this.methods.POST.defaultF;
        this.methods.POST[keyPath] = fn;
      }
    } else {
      this.methods.POST = fn;
    }
  }

  protected addPut(fn: ControllerFunction, keyPath?: string | undefined): void {
    if (keyPath !== undefined) {
      if (this.methods.PUT instanceof Function) {
        this.methods.PUT = { defaultF: this.methods.PUT, [keyPath]: fn };
      } else {
        this.methods.PUT.defaultF = this.methods.PUT.defaultF;
        this.methods.PUT[keyPath] = fn;
      }
    } else {
      this.methods.PUT = fn;
    }
  }

  // Funtions to response for method no implement
  private notFound(
    _: NextApiRequest,
    res: NextApiResponse<ResponseControllerNotFound<string>>
  ): void {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.BADREQUEST);
    throw new NoFoundError(
      `(${code.Meaning}) Method Not Found, Not Implement`,
      "NotFoundController"
    );
  }

  // Funtions to response for method no implement
  static handleError(
    res: NextApiResponse<ResponseControllerNotFound<ErrorReturn>>,
    error: ErrorEndpoint
  ): void {
    try {
      const getError = error.getErrorObject();
      res.status(getError.code).json({ error: getError });
    } catch (error) {
      const int = new InternalServerError("Error Unknow");
      res
        .status(int.getErrorObject().code)
        .json({ error: int.getErrorObject() });
    }
  }
}

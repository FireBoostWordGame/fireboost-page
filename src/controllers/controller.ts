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
import { $Enums, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import {
  ErrorEndpoint,
  InternalServerError,
  UnauthorizedError,
} from "@/errorManager";
import { NoFoundError } from "@/errorManager/error-notfound";
import { dbInstance } from "@/utils/const";
import SubController from "./sub-controller";

// Controller Class Base
// The controller inherate the class PrismaService whit add all methods to query
export default abstract class Controller implements IController {
  db: PrismaClient = dbInstance;
  // We control access to each route according to the roll Enum
  accessTypeMethod: Record<ControllerMethod, $Enums.Role | "any"> = {
    GET: "any",
    DELETE: "any",
    PATCH: "any",
    POST: "any",
    PUT: "any",
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

  constructor(public isParams: boolean) {}

  /* Add Method of the Sub Controller Paths */
  protected AddMethodsSubController(subController: SubController): void {
    subController.isParams = this.isParams;
    subController.AddMethods(this);
  }

  /*
    Function to Run Handle Request 
  */
  async run(
    mt: ControllerMethod | undefined,
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    // Verify to method send not is null or undefined
    if (mt === null || mt === undefined) mt = "GET";
    // Get data
    let fn = this.methods[mt];
    // Verify to Url not undifinde
    if (req.url !== undefined) {
      // Get last property of url
      const splits = req.url.split("/");
      let lengthToSeparated = splits.length - 1;
      let finishPathFormat = splits[lengthToSeparated];
      if (finishPathFormat.includes("?")) {
        const splitQuery = finishPathFormat.split("?");
        finishPathFormat = splitQuery[0];
      }
      if (this.isParams) {
        lengthToSeparated--;
        finishPathFormat = splits[lengthToSeparated];
      }

      // Verify what the data is the instance function
      if (fn instanceof Function) {
        if (fn !== null || fn !== undefined) await fn(req, res);
        // if the function is null or undefined send not found function
        else this.notFound(req, res);
      } else {
        // Get the function in object
        const func = fn[finishPathFormat];
        // if the functions is undefined send the default function in object
        if (func === undefined || func === null) {
          console.log("Undefined");
          const acces = fn.defaultF.accestType;
          this.verifyAccesMethod(req, acces);
          await fn.defaultF.method(req, res);
        } else {
          const acces = func.accestType;
          this.verifyAccesMethod(req, acces);
          // call function
          await func.method(req, res);
        }
      }
    } else {
      if (fn instanceof Function) {
        if (fn !== null || fn !== undefined) await fn(req, res);
        else await this.notFound(req, res);
      } else {
        const acces = fn.defaultF.accestType;
        this.verifyAccesMethod(req, acces);
        await fn.defaultF.method(req, res);
      }
    }
  }

  public addGet(
    fn: ControllerFunction,
    keyPath?: string | undefined,
    accestType: $Enums.Role = "USER"
  ): void {
    // Verify the KeyPath not undefined
    if (keyPath !== undefined) {
      // Verify is function
      if (this.methods.GET instanceof Function) {
        // add this function to defaultMethod and add in the keypath the Function
        this.methods.GET = {
          defaultF: {
            method: this.methods.GET,
            accestType: this.accessTypeMethod.GET,
          },
          [keyPath]: { method: fn, accestType },
        };
      } else {
        this.methods.GET.defaultF = this.methods.GET.defaultF;
        this.methods.GET[keyPath] = { method: fn, accestType };
      }
    } else {
      // Add function to single method object
      this.methods.GET = fn;
    }
  }

  public addDelete(
    fn: ControllerFunction,
    keyPath?: string | undefined,
    accestType: $Enums.Role = "USER"
  ): void {
    if (keyPath !== undefined) {
      if (this.methods.DELETE instanceof Function) {
        this.methods.DELETE = {
          defaultF: {
            method: this.methods.DELETE,
            accestType: this.accessTypeMethod.DELETE,
          },
          [keyPath]: { method: fn, accestType },
        };
      } else {
        this.methods.DELETE.defaultF = this.methods.DELETE.defaultF;
        this.methods.DELETE[keyPath] = { method: fn, accestType };
      }
    } else {
      this.methods.DELETE = fn;
    }
  }

  public addPatch(
    fn: ControllerFunction,
    keyPath?: string | undefined,
    accestType: $Enums.Role = "USER"
  ): void {
    if (keyPath !== undefined) {
      if (this.methods.PATCH instanceof Function) {
        this.methods.PATCH = {
          defaultF: {
            method: this.methods.PATCH,
            accestType: this.accessTypeMethod.PATCH,
          },
          [keyPath]: { method: fn, accestType },
        };
      } else {
        this.methods.PATCH.defaultF = this.methods.PATCH.defaultF;
        this.methods.PATCH[keyPath] = { method: fn, accestType };
      }
    } else {
      this.methods.PATCH = fn;
    }
  }

  public addPost(
    fn: ControllerFunction,
    keyPath?: string | undefined,
    accestType: $Enums.Role = "USER"
  ): void {
    if (keyPath !== undefined) {
      if (this.methods.POST instanceof Function) {
        this.methods.POST = {
          defaultF: {
            method: this.methods.POST,
            accestType: this.accessTypeMethod.POST,
          },
          [keyPath]: { method: fn, accestType },
        };
      } else {
        this.methods.POST.defaultF = this.methods.POST.defaultF;
        this.methods.POST[keyPath] = { method: fn, accestType };
      }
    } else {
      this.methods.POST = fn;
    }
  }

  public addPut(
    fn: ControllerFunction,
    keyPath?: string | undefined,
    accestType: $Enums.Role = "USER"
  ): void {
    if (keyPath !== undefined) {
      if (this.methods.PUT instanceof Function) {
        this.methods.PUT = {
          defaultF: {
            method: this.methods.PUT,
            accestType: this.accessTypeMethod.PUT,
          },
          [keyPath]: { method: fn, accestType },
        };
      } else {
        this.methods.PUT.defaultF = this.methods.PUT.defaultF;
        this.methods.PUT[keyPath] = { method: fn, accestType };
      }
    } else {
      this.methods.PUT = fn;
    }
  }

  // Funtions to response for method no implement
  private notFound(
    _: NextApiRequest,
    __: NextApiResponse<ResponseControllerNotFound<string>>
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
      res.status(getError.error.code).json(getError);
    } catch (error) {
      const getErrorw = new InternalServerError(
        "Error Unknow"
      ).getErrorObject();
      res.status(getErrorw.error.code).json(getErrorw);
    }
  }

  verifyAccesMethod(req: NextApiRequest, acces: $Enums.Role | "any"): void {
    if (req.headers["role"]) {
      if (req.headers["role"] !== $Enums.Role.ADMIN) {
        switch (acces) {
          case "any":
            throw new UnauthorizedError("Not Role Same; Need a Role");

          case "ADMIN":
            throw new UnauthorizedError("Not Role Same; Need the Role = Admin");
          case "BOOSTER":
            if (
              req.headers["role"] === $Enums.Role.BOOSTER ||
              req.headers["role"] === $Enums.Role.ADMIN
            ) {
              break;
            } else {
              throw new UnauthorizedError(
                "Not Role Same; Need the Role = Employee or Admin"
              );
            }

          case "USER":
            if (
              req.headers["role"] === $Enums.Role.USER ||
              req.headers["role"] === $Enums.Role.BOOSTER ||
              req.headers["role"] === $Enums.Role.ADMIN
            ) {
              break;
            } else {
              throw new UnauthorizedError("Your Need Register");
            }
        }
      }
    }
  }
}

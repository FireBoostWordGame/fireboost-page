import { NextApiRequest, NextApiResponse } from "next";
import Controller from "../controller";
import { $Enums, User, UserBooster } from "@prisma/client";
import {
  HttpStatusKeysMore,
  TypeVerify,
  type ControllerMethod,
} from "../../types";
import HttpStatusManagement from "@/utils/http-status-management";
import {
  ErrorEndpoint,
  InternalServerError,
  NoContentError,
  NotAcceptableError,
} from "@/errorManager";
import UsePagination from "@/utils/usePagination";

export default class UserController extends Controller {
  accessTypeMethod: Record<ControllerMethod, $Enums.Role | "any"> = {
    GET: $Enums.Role.USER,
    DELETE: "any",
    PATCH: "any",
    POST: "any",
    PUT: "any",
  };
  constructor(isParams: boolean) {
    super(isParams);
    this.addGet(this.GET.bind(this));
    this.addGet(this.GETAll.bind(this), "all", $Enums.Role.ADMIN);
  }

  private async GET(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);

    try {
      if (req.query.type === undefined && Array.isArray(req.query.type)) {
        req.query.type = "user";
      }
      console.log(req.body);
      if (req.query.id === undefined || Array.isArray(req.query.id)) {
        throw new NotAcceptableError(
          "Need Id Param for this method",
          "Not send Id Param"
        );
      }
      let user: User | UserBooster | null;
      if (req.query.type === "userbooster") {
        user = await this.db.userBooster.findFirst({
          where: {
            id: req.query.id,
          },
        });
      } else {
        user = await this.db.user.findFirst({
          where: {
            id: req.query.id,
          },
        });
      }
      if (user === undefined) {
        throw new NoContentError(
          `User whit this id = ${req.query.id}`,
          "Get User by id; not user whit this id"
        );
      }
      return res.status(code.Code).json({ user });
    } catch (error: unknown) {
      if (error instanceof ErrorEndpoint) {
        throw error;
      } else {
        throw new InternalServerError("User by id");
      }
    }
  }

  private async GETAll(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);
    let type: TypeVerify = "user";
    if (req.body.type !== undefined && !Array.isArray(req.body.type)) {
      type = req.body.type as TypeVerify;
    }

    const pagination = UsePagination("/api/users/all", req.query);
    const paginationsSkipTake = {
      skip: pagination.skip,
      take: pagination.take,
    };
    let users: any[];
    if (type === "userbooster") {
      users = await this.db.userBooster.findMany(paginationsSkipTake);
      console.log(type);
    } else {
      users = await this.db.user.findMany(paginationsSkipTake);
      console.log(type);
    }

    return res.status(code.Code).json({
      pagination: pagination.url,
      users,
    });
  }
}

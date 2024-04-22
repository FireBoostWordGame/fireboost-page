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
  BadRequestError,
  NoContentError,
  NotAcceptableError,
  UnauthorizedError,
} from "@/errorManager";
import { UsePaginationType } from "@/utils/usePagination";
import { isObjectId } from "@/utils";

export default class UserController extends Controller {
  userKey: string[] = ["name", "email", "password"];
  userBoostersKey: string[] = [
    "name",
    "email",
    "password",
    "contact",
    "availability",
    "discordNick",
    "facebook",
    "country",
    "city",
    "league",
    "paypal",
    "completeBoosts",
  ];
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
    this.addDelete(this.DELETE.bind(this));
    this.addPatch(this.PATCH.bind(this));
  }

  private async GET(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);

    if (req.query.type === undefined && Array.isArray(req.query.type)) {
      req.query.type = "user";
    }

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
  }

  private async GETAll(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);
    let type: TypeVerify = "user";
    if (req.query.type !== undefined && !Array.isArray(req.query.type)) {
      type = req.query.type as TypeVerify;
    }

    const pagination = UsePaginationType("/api/users/all", req.query);
    const paginationsSkipTake = {
      skip: pagination.skip,
      take: pagination.take,
    };
    let users: any[];
    if (type === "userbooster") {
      users = await this.db.userBooster.findMany(paginationsSkipTake);
    } else {
      users = await this.db.user.findMany(paginationsSkipTake);
    }

    return res.status(code.Code).json({
      pagination: pagination.url,
      users,
    });
  }

  private async DELETE(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);

    const id = req.query.id;
    let type = req.query.type;
    if (id === undefined || Array.isArray(id) || !isObjectId(id)) {
      throw new NotAcceptableError(
        "Need Id Param for this method",
        "Not send Id Param"
      );
    }

    if (type === undefined || Array.isArray(type) || !isObjectId(type)) {
      type = "user";
    }

    const role = req.headers["role"];
    const idUserToken = req.headers["idUser"];
    if (role !== $Enums.Role.ADMIN) {
      if (idUserToken !== id) {
        throw new UnauthorizedError("Delete User; The ids not same");
      }
    }

    if (type === "user") {
      await this.db.user.delete({
        where: { id },
      });
    } else if (type === "userbooster") {
      await this.db.userBooster.delete({
        where: { id },
      });
    } else {
      throw new NoContentError(`Not ${type} whit this id`, `Delete User`);
    }
    const registersupdate = await this.db.userUpdateAdmin.findFirst({
      where: {
        userIdUpdate: id,
      },
    });
    if (registersupdate !== null) {
      await this.db.userUpdateAdmin.delete({
        where: {
          id: registersupdate.id,
        },
      });
    }
    res.status(code.Code).json({
      code: `(${code.Meaning})`,
      message: `${type.toUpperCase()} Deleted`,
    });
  }

  private async PATCH(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);

    const id = req.query.id;
    let type = req.query.type;
    if (id === undefined || Array.isArray(id) || !isObjectId(id)) {
      throw new NotAcceptableError(
        "Need Id Param for this method",
        "Not send Id Param"
      );
    }
    if (type === undefined || Array.isArray(type) || !isObjectId(type)) {
      type = "user";
    }

    if (
      Object.keys(req.body).length === 0 ||
      req.body === undefined ||
      req.body === null
    ) {
      throw new NotAcceptableError(`Need the body`, "User Update");
    }
    const userUpdate: Record<string, any> = {};
    let userupdated = {};
    if (type === "user") {
      this.userKey.forEach((uk) => {
        if (Object.keys(req.body).includes(uk)) {
          userUpdate[uk] = req.body[uk];
        }
      });
      userupdated = await this.db.user.update({
        data: userUpdate as Partial<User>,
        where: {
          id,
        },
      });
    } else if (type === "userbooster") {
      this.userBoostersKey.forEach((uk) => {
        if (Object.keys(req.body).includes(uk)) {
          userUpdate[uk] = req.body[uk];
        }
      });
      userupdated = await this.db.userBooster.update({
        data: userUpdate as Partial<UserBooster>,
        where: {
          id,
        },
      });
    } else {
      throw new BadRequestError("Need Type", "User Update");
    }

    res.status(code.Code).json({ user: userupdated });
  }
}

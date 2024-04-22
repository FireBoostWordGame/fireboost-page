import { ControllerMethod, HttpStatusKeysMore } from "@/types";
import Controller from "../controller";
import { $Enums } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import HttpStatusManagement from "@/utils/http-status-management";
import {
  BadRequestError,
  NoContentError,
  NotAcceptableError,
} from "@/errorManager";
import { isObjectId } from "@/utils";
import { SEPARATOR_UPDATE_USER } from "@/utils/const";

export type ToRole = "toAdmin" | "toUser";
export interface RegisterCount {
  date: string;
  convert: ToRole;
  idUserAdmin: string;
}
export interface Register {
  idUserToUpdater: string;
  registers: RegisterCount[];
}
export default class AdminUpdateController extends Controller {
  acceptKeys = ["idUpdate", "date"];
  accessTypeMethod: Record<ControllerMethod, $Enums.Role | "any"> = {
    GET: "any",
    DELETE: "any",
    PATCH: "any",
    POST: $Enums.Role.ADMIN,
    PUT: "any",
  };

  constructor(isParam: boolean = false) {
    super(isParam);
    this.addPost(this.POST.bind(this));
    this.addGet(this.GET.bind(this));
  }

  private async POST(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    const code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);

    if (!Object.keys(req.body).every((ks) => this.acceptKeys.includes(ks))) {
      throw new BadRequestError(
        `Need all keys ${this.acceptKeys.join(", ")}`,
        "Convert User to Admin"
      );
    }

    const adminId = req.headers["userId"];
    if (
      adminId === undefined ||
      Array.isArray(adminId) ||
      req.body.idUpdate === undefined ||
      !isObjectId(req.body.idUpdate)
    ) {
      throw new BadRequestError(
        "Error to ids not Objects Id",
        "Convert User to Admin"
      );
    }

    let idUpdated: string = req.body.idUpdate;

    const date = new Date(req.body.date);
    if (date === null) {
      throw new NotAcceptableError(
        "Error to conver Date",
        "Convert User to Admin"
      );
    }

    const userUpdateSearch = await this.db.user.findFirst({
      where: {
        id: req.body.idUpdate,
      },
    });

    if (userUpdateSearch === null) {
      throw new NoContentError("User Update", "Convert User to Admin");
    }

    let role: $Enums.Role = $Enums.Role.ADMIN;
    let toRole: ToRole = "toAdmin";
    if (userUpdateSearch.role === $Enums.Role.ADMIN) {
      role = $Enums.Role.USER;
      toRole = "toUser";
    }
    await this.db.user.update({
      data: {
        role,
      },
      where: {
        id: userUpdateSearch.id,
      },
    });
    let dateIsAdmin = `${req.body.date}${SEPARATOR_UPDATE_USER}${toRole}${SEPARATOR_UPDATE_USER}${adminId}`;
    const userUpdateAdminR = await this.db.userUpdateAdmin.findFirst({
      where: {
        userIdUpdate: idUpdated,
      },
    });

    if (userUpdateAdminR !== null) {
      userUpdateAdminR.dateIsAdmins.push(dateIsAdmin);
      await this.db.userUpdateAdmin.update({
        data: {
          dateIsAdmins: userUpdateAdminR.dateIsAdmins,
          userIdUpdate: userUpdateAdminR.userIdUpdate,
        },
        where: {
          id: userUpdateAdminR.id,
        },
      });
    } else {
      await this.db.userUpdateAdmin.create({
        data: {
          userIdUpdate: req.body.idUpdate,
          dateIsAdmins: [dateIsAdmin],
        },
      });
    }

    return res.status(code.Code).json({
      meaning: `(${code.Meaning})`,
      message: `User Update to ${role}`,
    });
  }

  private async GET(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);

    if (
      req.query.id === undefined ||
      Array.isArray(req.query.id) ||
      req.query.id === null ||
      !isObjectId(req.query.id)
    ) {
      throw new BadRequestError(
        "Need Id For send registers",
        "Admin Update Get Registers"
      );
    }
    let id = req.query.id;
    const register = await this.db.userUpdateAdmin.findFirst({
      where: {
        userIdUpdate: id,
      },
    });
    if (register === null) {
      throw new NoContentError(
        "Register Amin Update",
        "Admin Update Get Registers"
      );
    }
    const registerFormat: Register = {
      idUserToUpdater: register.userIdUpdate,
      registers: register.dateIsAdmins.map((dia) => {
        const separetee = dia.split(SEPARATOR_UPDATE_USER);
        return {
          date: separetee[0],
          convert: separetee[1] as ToRole,
          idUserAdmin: separetee[2],
        };
      }),
    };

    res.status(code.Code).json({
      code: `(${code.Meaning})`,
      register: registerFormat,
    });
  }
}

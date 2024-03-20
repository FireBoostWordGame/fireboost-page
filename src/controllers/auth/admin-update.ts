import { ControllerMethod, HttpStatusKeysMore } from "@/types";
import Controller from "../controller";
import { $Enums, UserUpdateAdmin } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import HttpStatusManagement from "@/utils/http-status-management";
import {
  BadRequestError,
  NoContentError,
  NotAcceptableError,
} from "@/errorManager";
import { isObjectId } from "@/utils";
import { SEPARATOR_UPDATE_USER } from "@/utils/const";

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
  }

  private async POST(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    const code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);
    try {
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
      let toRole = "toAdmin";
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
    } catch (error) {
      throw error;
    }
  }
}

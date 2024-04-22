import { NextApiRequest, NextApiResponse } from "next";
import Controller from "../controller";
import {
  ControllerMethod,
  HttpStatusKeysMore,
  TypeVerify,
  type UserBase,
} from "../../types";
import md5 from "md5";
import HttpStatusManagement from "@/utils/http-status-management";
import {
  BadRequestError,
  ConflictError,
  NotAcceptableError,
} from "@/errorManager";
import { $Enums, User } from "@prisma/client";
import { isObjectId } from "@/utils";

export default class SingUpController extends Controller {
  private keysValues: string[] = ["name", "password", "email"];
  accessTypeMethod: Record<ControllerMethod, $Enums.Role | "any"> = {
    GET: "any",
    DELETE: "any",
    PATCH: "any",
    POST: "any",
    PUT: "any",
  };
  constructor(isParam: boolean = false) {
    super(isParam);
    this.addPost(this.POST.bind(this));
    this.addPatch(this.PATCH.bind(this));
  }

  private async POST(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    // Get code update for response
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);
    let defaultIdAdmin = "1234";

    // Verify what the body is complete
    if (
      !this.keysValues.every((kValues) =>
        Object.keys(req.body).includes(kValues)
      )
    ) {
      throw new NotAcceptableError(
        `Need All Values for create user ${this.keysValues.join(", ")}`,
        "Keys, Post SingUp"
      );
    }

    if (req.body.idAdmin === undefined || req.body.idAdmin === null) {
      req.body.idAdmin = defaultIdAdmin;
    }

    const data = req.body as UserBase;

    // Search same email
    const user = await this.db.user.count({
      where: {
        email: data.email,
      },
    });
    const userB = await this.db.userBooster.count({
      where: {
        email: data.email,
      },
    });

    // Verify the not user whit email same
    if (user !== 0 || userB !== 0) {
      throw new NotAcceptableError(
        `Exist user whit this Email`,
        "User whit Email exist, Post SingUp"
      );
    }

    let userCreate: User;
    if (data.idAdmin === defaultIdAdmin) {
      // Create User
      userCreate = await this.db.user.create({
        data: {
          email: data.email,
          name: data.name,
          active: false,
          role: "USER",
          password: md5(data.password),
        },
      });
    } else {
      if (!isObjectId(data.idAdmin)) {
        throw new NotAcceptableError(
          "Not aceptable Id Admin not is Object Id",
          "SingUp"
        );
      }
      const userAdmin = await this.db.user.findFirst({
        where: {
          id: data.idAdmin,
          role: $Enums.Role.ADMIN,
        },
      });

      if (userAdmin === null || userAdmin === undefined) {
        throw new ConflictError(
          "User Admin not exist",
          "Create Sing Up User Booster"
        );
      }
      // Create User Booster

      userCreate = await this.db.userBooster.create({
        data: {
          name: data.name,
          email: data.email,
          active: true,
          role: $Enums.Role.BOOSTER,
          contact: "",
          availability: "",
          discordNick: "",
          facebook: "",
          country: "",
          city: "",
          league: "",
          userIdAdmin: userAdmin.id,
          paypal: "",
          completeBoosts: 0,
          password: md5(data.password),
        },
      });
    }

    return res
      .status(code.Code)
      .json({ code: `(${code.Meaning})`, data: userCreate });
  }

  private async PATCH(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);

    if (req.query.id === undefined || Array.isArray(req.query.id)) {
      throw new BadRequestError("Need Id for the request", "Active Account");
    }
    if (req.body.type === undefined || Array.isArray(req.body.type) === false) {
      req.body.type = "user";
    }
    const id = req.query.id;
    const type = req.body.type as TypeVerify;
    if (type === "userbooster") {
      await this.db.userBooster.update({
        data: {
          active: true,
        },
        where: {
          id,
        },
      });
    } else if (type === "user") {
      await this.db.user.update({
        data: {
          active: true,
        },
        where: {
          id,
        },
      });
    } else {
      throw new BadRequestError(
        `the Type is not recognized only user and userbooster`,
        "Active Account"
      );
    }
    res.status(code.Code).json({
      message: `(${code.Meaning}) The Account whit id ${id} is Active`,
    });
  }
}

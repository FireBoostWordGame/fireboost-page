import { NextApiRequest, NextApiResponse } from "next";
import Controller from "../controller";
import { HttpStatusKeysMore, type UserBase } from "../../types";
import md5 from "md5";
import HttpStatusManagement from "@/utils/http-status-management";
import {
  ErrorEndpoint,
  InternalServerError,
  NotAcceptableError,
} from "@/errorManager";

export default class SingUpController extends Controller {
  private keysValues: string[] = ["name", "password", "email"];
  constructor() {
    super();
    this.addPost(this.POST.bind(this));
  }

  private async POST(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    // Get code update for response
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);
    try {
      // Verify what the body is complete
      if (
        !this.keysValues
          .map((kValues) => Object.keys(req.body).includes(kValues))
          .every(Boolean)
      ) {
        throw new NotAcceptableError(
          `Need All Values for create user ${this.keysValues.join(", ")}`,
          "Keys, Post SingUp"
        );
      }
      const data = req.body as UserBase;

      // Search same email
      const user = await this.prisma.user.findFirst({
        where: {
          email: data.email,
        },
      });
      // Verify the not user whit email same
      if (user !== null) {
        throw new NotAcceptableError(
          `Exist user whit this Email`,
          "User whit Email exist, Post SingUp"
        );
      }
      // Create User
      const userCreate = await this.prisma.user.create({
        data: {
          ...data,
          active: false,
          role: "USER",
          password: md5(data.password),
        },
      });
      return res
        .status(code.Code)
        .json({ code: `(${code.Meaning})`, data: userCreate });
    } catch (error: unknown) {
      if (error instanceof ErrorEndpoint) {
        throw error;
      } else {
        throw new InternalServerError(`Error to Create User, Post Singup`);
      }
    }
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import Controller from "../controller";
import { HttpStatusKeysMore, type UserBase } from "@/types";
import md5 from "md5";

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
    let code = this.httpStatuses.getCode(HttpStatusKeysMore.ACCEPTED);
    try {
      if (
        !this.keysValues
          .map((kValues) => Object.keys(req.body).includes(kValues))
          .every(Boolean)
      ) {
        code = this.httpStatuses.getCode(HttpStatusKeysMore.NOTACCEPTABLE);
        return res.status(code.Code).json({
          error: `(${
            code.Meaning
          }) Need All Values for create user ${this.keysValues.join(", ")}`,
        });
      }
      const data = req.body as UserBase;

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
      if (error instanceof Error) {
        code = this.httpStatuses.getCode(HttpStatusKeysMore.BADREQUEST);
        return res.status(code.Code).json({
          error: `(${code.Meaning}) Error to Create User ${error.message}`,
        });
      } else {
        return res.status(code.Code).json({
          error: `(${code.Meaning}) Error to Create User`,
        });
      }
    }
  }
}

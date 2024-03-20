import { IUseToken, TokenResult, TypeVerify } from "../types";
import * as jwt from "jsonwebtoken";

export default function UseTokenVerify(token: string): IUseToken | string {
  try {
    const retoken = jwt.decode(token) as TokenResult;
    const currentDate = new Date();
    const expiresDate = new Date(retoken.exp * 1000);
    const isExpired = +expiresDate <= +currentDate;
    // const initDate = new Date(retoken.iat * 1000);
    // console.log({
    //   retoken,
    //   expiresDate,
    //   currentDate,
    //   expiresDateT: +expiresDate,
    //   currentDateT: +currentDate,
    //   initDate,
    //   isExpired,
    // });
    return {
      isExpired,
      role: retoken.role,
      sub: retoken.sub,
    };
  } catch (error) {
    return "Token Invalid";
  }
}

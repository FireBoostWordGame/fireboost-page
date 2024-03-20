export interface UserCredentials {
  email: string;
  password: string;
}

export type TypeVerify = "userbooster" | "user";

export type UserCredentialsType = UserCredentials & { type: TypeVerify };
export type UserCredentialsId = UserCredentials & { idAdmin: string };

export interface UserBase extends UserCredentialsId {
  name: string;
}

export interface User extends UserBase {
  role: string;
  active: boolean;
}

export interface UserWhitID extends User {
  id: string;
}

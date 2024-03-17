export interface UserLogin {
  email: string;
  password: string;
}

export interface UserBase extends UserLogin {
  name: string;
}

export interface User extends UserBase {
  role: string;
  active: boolean;
}

export interface UserWhitID extends User {
  id: string;
}

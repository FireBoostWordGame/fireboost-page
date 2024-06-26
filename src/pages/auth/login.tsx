import FETCHS from "@/front/utils/fetchs";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  async function HandleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await FETCHS.auth.Login(email, password, router);
  }
  return (
    <form onSubmit={HandleSubmit}>
      <label>
        Email:
        <input
          type="text"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </label>
      <input type="submit" value="Send" />
    </form>
  );
}

import LocalStorageService from "@/services/storage/localstorage";
import { NextRouter } from "next/router";

export async function Login(
  email: string,
  password: string,
  router?: NextRouter
): Promise<void> {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    email,
    password,
  });

  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  });

  const responser = await response.json();
  if (!responser.error) {
    LocalStorageService.post("token", responser.token);
    LocalStorageService.post("user", responser.user);
    if (router !== undefined) {
      router.push("/");
    }
  }
}

export async function Singup(
  name: string,
  email: string,
  password: string,
  router?: NextRouter
): Promise<void> {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    name,
    email,
    password,
  });

  const response = await fetch("/api/auth/singup", {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  });

  const responser = await response.json();

  if (!responser.error) {
    if (router !== undefined) {
      router.push("/auth/login");
    }
  }
}

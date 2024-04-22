import LocalStorageService from "@/services/storage/localstorage";
import { PaginationUrl } from "@/types";
import { Game } from "@prisma/client";

export interface ResponseReturn {
  games: Game[];
  paginationUrl: PaginationUrl;
}
export async function GetGames(
  apiRoute: string = "/api/games/all"
): Promise<ResponseReturn | string> {
  const token = LocalStorageService.get("token");
  const myHeaders = new Headers();
  console.log(token);
  myHeaders.append("token", token);

  const response = await fetch(apiRoute, {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  });

  const responser = await response.json();

  if (!responser.error) {
    return {
      games: responser.games,
      paginationUrl: responser.pagination.url,
    };
  }
  return responser.error.message;
}

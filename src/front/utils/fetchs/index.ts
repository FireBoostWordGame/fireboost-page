import { Login, Singup } from "./auth";
import { GetGames } from "./games";

const FETCHS = {
  auth: { Login, Singup },
  games: { GetGames },
};

export default FETCHS;

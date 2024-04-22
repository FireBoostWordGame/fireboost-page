import FETCHS from "@/front/utils/fetchs";
import { ResponseReturn } from "@/front/utils/fetchs/games";
import { useEffect, useState } from "react";

export default function Boosting() {
  const [games, setGames] = useState<ResponseReturn | null>(null);
  async function GetGames() {
    let vGames = await FETCHS.games.GetGames();
    if (typeof vGames === "string") {
      //TODO: Error = true
    } else {
      setGames(vGames);
    }
  }
  useEffect(() => {
    GetGames();
  }, []);
  return (
    <div>
      {games?.games.map((g, index) => {
        return (
          <div key={`fffff-${index}`}>
            {g.name}
            <button>See Actions</button>
          </div>
        );
      })}
    </div>
  );
}

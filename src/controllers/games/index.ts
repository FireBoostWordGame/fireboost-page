import { ControllerMethod, HttpStatusKeysMore } from "@/types";
import Controller from "../controller";
import { $Enums, Game } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import {
  BadRequestError,
  NotAcceptableError,
  UnauthorizedError,
} from "@/errorManager";
import HttpStatusManagement from "@/utils/http-status-management";
import { isObjectId } from "@/utils";
import { UsePaginationType } from "@/utils/usePagination";
import SubController from "../sub-controller";

export default class GamesController extends Controller {
  acceptKeysPost: string[] = ["name", "iconUrl", "pageUrl", "priceBase"];
  accessTypeMethod: Record<ControllerMethod, $Enums.Role | "any"> = {
    GET: "any",
    DELETE: $Enums.Role.ADMIN,
    PATCH: $Enums.Role.ADMIN,
    POST: $Enums.Role.ADMIN,
    PUT: "any",
  };
  constructor(isParams: boolean, ...subControllers: SubController[]) {
    super(isParams);
    this.addPost(this.POST.bind(this));
    this.addPatch(this.PATCH.bind(this));
    this.addDelete(this.DELETE.bind(this));

    this.addGet(this.GET.bind(this));
    this.addGet(this.GETAll.bind(this), "all", $Enums.Role.ADMIN);

    if (subControllers.length > 0) {
      this.AddMethodsSC(subControllers);
    }
  }

  private AddMethodsSC(scs: SubController[]): void {
    scs.forEach((sc) => {
      this.AddMethodsSubController(sc);
    });
  }
  async POST(req: NextApiRequest, res: NextApiResponse<any>): Promise<void> {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);

    if (
      req.body.priceBase === undefined ||
      req.body.priceBase === null ||
      Array.isArray(req.body.priceBase)
    ) {
      req.body.priceBase = 10;
    }
    if (
      !Object.keys(req.body).every((ke) => this.acceptKeysPost.includes(ke))
    ) {
      throw new BadRequestError("Need all Body", "Create Game");
    }

    const gameCreate = await this.db.game.create({
      data: req.body as Game,
    });

    res.status(code.Code).json({
      game: gameCreate,
    });
  }

  private async GETAll(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);

    const pagination = UsePaginationType("/api/users/all", req.query);
    const paginationsSkipTake = {
      skip: pagination.skip,
      take: pagination.take,
    };
    const games = await this.db.game.findMany(paginationsSkipTake);
    res.status(code.Code).json({
      code: `(${code.Meaning})`,
      games,
      pagination: pagination.url,
    });
  }

  private async GET(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);

    if (req.query.id === undefined || Array.isArray(req.query.id)) {
      throw new NotAcceptableError(
        "Need Id Param for this method",
        "Not send Id Param"
      );
    }
    let id = req.query.id;
    const game = await this.db.game.findFirst({
      where: {
        id,
      },
    });
    res.status(code.Code).json({
      code: `(${code.Meaning})`,
      game,
    });
  }

  private async PATCH(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);

    const id = req.query.id;
    if (id === undefined || Array.isArray(id) || !isObjectId(id)) {
      throw new NotAcceptableError(
        "Need Id Param for this method",
        "Not send Id Param"
      );
    }

    if (
      Object.keys(req.body).length === 0 ||
      req.body === undefined ||
      req.body === null
    ) {
      throw new NotAcceptableError(`Need the body`, "User Update");
    }
    const gameUpdate: Record<string, any> = {};

    this.acceptKeysPost.forEach((uk) => {
      if (Object.keys(req.body).includes(uk)) {
        gameUpdate[uk] = req.body[uk];
      }
    });
    const userupdated = await this.db.game.update({
      data: gameUpdate as Partial<Game>,
      where: {
        id,
      },
    });

    res.status(code.Code).json({ game: userupdated });
  }

  private async DELETE(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);

    const id = req.query.id;
    if (id === undefined || Array.isArray(id) || !isObjectId(id)) {
      throw new NotAcceptableError(
        "Need Id Param for this method",
        "Not send Id Param"
      );
    }

    const role = req.headers["role"];
    if (role !== $Enums.Role.ADMIN) {
      throw new UnauthorizedError("Delete USer; The ids not same");
    }

    await this.db.game.delete({
      where: {
        id,
      },
    });

    //TODO: Delete Positions and Delete Boosts

    res.status(code.Code).json({
      code: `(${code.Meaning})`,
      message: `Game Whit ${id} Deleted`,
    });
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import Controller from "@/controllers/controller";
import HttpStatusManagement from "@/utils/http-status-management";
import { HttpStatusKeysMore } from "@/types";
import { BadRequestError, NotAcceptableError } from "@/errorManager";
import { isObjectId } from "@/utils";
import { $Enums, RequestBoost, StateBoost } from "@prisma/client";
import { randomUUID } from "crypto";
import { UsePaginationType } from "@/utils/usePagination";

export default class RequestBoostController extends Controller {
  acceptedKeysPost = [
    "dateRequest",
    "order",
    "price",
    "dateDelivery",
    "paymentMethod",
    "paid",
    "state",
    "actualPosition",
    "desiredPosition",
    "gameId",
    "userId",
    "userBoostersId",
  ];
  constructor(isParams: boolean) {
    super(isParams);
    this.addPost(this.POST.bind(this));

    this.addGet(this.GET.bind(this));
    this.addGet(this.GETByBoost.bind(this), "userboost", $Enums.Role.BOOSTER);
    this.addGet(this.GETByGame.bind(this), "game", $Enums.Role.ADMIN);
    this.addGet(this.GETByUser.bind(this), "user", $Enums.Role.USER);

    this.addPatch(this.PATCHstate.bind(this), "state", $Enums.Role.BOOSTER);
    this.addPatch(this.PATCHactive.bind(this), "active", $Enums.Role.BOOSTER);

    this.addDelete(this.DELETE.bind(this));
  }

  async POST(req: NextApiRequest, res: NextApiResponse<any>): Promise<void> {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);
    if (
      !Object.keys(req.body).every((ke) => this.acceptedKeysPost.includes(ke))
    ) {
      throw new BadRequestError("Need all Body", "Create Request Boost");
    }

    let idsComprobate = [
      await this.VerifyExistGameId(req.body.gameId),
      await this.VerifyExistUserBoostersId(req.body.userBoostersId),
      await this.VerifyExistUserId(req.body.userId),
    ];

    if (!idsComprobate.every(Boolean)) {
      throw new BadRequestError("Need Ids Correctly", "Request Boosts");
    }

    req.body.dateRequest = new Date();
    req.body.state = StateBoost.PENDING;
    req.body.idRequest = randomUUID(); // Id For Client

    const requestboostCreate = await this.db.requestBoost.create({
      data: req.body as RequestBoost,
    });

    res.status(code.Code).json({
      request: requestboostCreate,
    });
  }

  async GET(req: NextApiRequest, res: NextApiResponse<any>): Promise<void> {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);
    const pagination = UsePaginationType("/api/boosts", req.query);
    const paginationsSkipTake = {
      skip: pagination.skip,
      take: pagination.take,
    };
    const requestsBoosts = await this.db.requestBoost.findMany(
      paginationsSkipTake
    );

    res.status(code.Code).json({
      code: `(${code.Meaning})`,
      requests: requestsBoosts,
      pagination: pagination.url,
    });
  }

  async GETByBoost(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);
    const id = req.query.id;
    if (
      id === undefined ||
      id === null ||
      Array.isArray(id) ||
      !isObjectId(id)
    ) {
      throw new NotAcceptableError(
        "Need Id Param for this method",
        "Not send Id Param"
      );
    }
    const pagination = UsePaginationType(
      `/api/boosts/userboost/${id}`,
      req.query
    );
    const paginationsSkipTake = {
      skip: pagination.skip,
      take: pagination.take,
    };
    const requestsBoosts = await this.db.requestBoost.findMany({
      where: {
        userBoostersId: id,
      },
      ...paginationsSkipTake,
    });

    res.status(code.Code).json({
      code: `(${code.Meaning})`,
      requests: requestsBoosts,
      pagination: pagination.url,
    });
  }
  async GETByGame(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);
    const id = req.query.id;
    if (
      id === undefined ||
      id === null ||
      Array.isArray(id) ||
      !isObjectId(id)
    ) {
      throw new NotAcceptableError(
        "Need Id Param for this method",
        "Not send Id Param"
      );
    }
    const pagination = UsePaginationType(`/api/boosts/game/${id}`, req.query);
    const paginationsSkipTake = {
      skip: pagination.skip,
      take: pagination.take,
    };
    const requestsBoosts = await this.db.requestBoost.findMany({
      where: {
        gameId: id,
      },
      ...paginationsSkipTake,
    });

    res.status(code.Code).json({
      code: `(${code.Meaning})`,
      requests: requestsBoosts,
      pagination: pagination.url,
    });
  }

  async GETByUser(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);
    const id = req.query.id;
    if (
      id === undefined ||
      id === null ||
      Array.isArray(id) ||
      !isObjectId(id)
    ) {
      throw new NotAcceptableError(
        "Need Id Param for this method",
        "Not send Id Param"
      );
    }
    const pagination = UsePaginationType(`/api/boosts/user/${id}`, req.query);
    const paginationsSkipTake = {
      skip: pagination.skip,
      take: pagination.take,
    };
    const requestsBoosts = await this.db.requestBoost.findMany({
      where: {
        userId: id,
      },
      ...paginationsSkipTake,
    });

    res.status(code.Code).json({
      code: `(${code.Meaning})`,
      requests: requestsBoosts,
      pagination: pagination.url,
    });
  }

  async PATCHstate(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);
    const StatesAccepted = ["COMPLETE", "PROGRESS", "PENDING"];
    const state = req.body.state;
    let isState = false;
    const id = req.query.id;
    StatesAccepted.forEach((st) => {
      if (!isState) {
        if (st === state) {
          isState = true;
        }
      }
    });
    if (!isState) {
      throw new NotAcceptableError(
        `Need only this States: ${StatesAccepted.join(", ")}`,
        "Not send Id Param"
      );
    }

    if (
      id === undefined ||
      id === null ||
      Array.isArray(id) ||
      !isObjectId(id)
    ) {
      throw new NotAcceptableError(
        "Need Id Param for this method",
        "Not send Id Param"
      );
    }

    await this.db.requestBoost.update({
      where: {
        id,
      },
      data: {
        state: state as StateBoost,
      },
    });

    res.status(code.Code).json({
      code: `(${code.Meaning})`,
      update: true,
    });
  }

  async PATCHactive(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);
    const id = req.query.id;
    if (
      id === undefined ||
      id === null ||
      Array.isArray(id) ||
      !isObjectId(id)
    ) {
      throw new NotAcceptableError(
        "Need Id Param for this method",
        "Not send Id Param"
      );
    }
    const rb = await this.db.requestBoost.findFirst({
      where: {
        id,
      },
    });

    if (rb === null) {
      throw new NotAcceptableError(
        "Not Reques Boost whit this id",
        "Not Id Correct"
      );
    }

    await this.db.requestBoost.update({
      where: { id },
      data: {
        active: !rb.active,
      },
    });

    res.status(code.Code).json({
      deleting: true,
    });
  }

  async DELETE(req: NextApiRequest, res: NextApiResponse<any>): Promise<void> {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);
    const id = req.query.id;
    if (
      id === undefined ||
      id === null ||
      Array.isArray(id) ||
      !isObjectId(id)
    ) {
      throw new NotAcceptableError(
        "Need Id Param for this method",
        "Not send Id Param"
      );
    }

    const admin = req.body.idAdmin;
    if (
      admin === undefined ||
      admin === null ||
      Array.isArray(admin) ||
      !isObjectId(admin)
    ) {
      throw new NotAcceptableError(
        "Need Id Admin for this method",
        "Not send Id Param"
      );
    }

    const adminUser = await this.db.user.findFirst({
      where: {
        id: admin,
      },
    });

    if (adminUser === null) {
      throw new NotAcceptableError("Admin User not exist", "");
    }

    await this.db.requestBoost.delete({
      where: { id },
    });

    res.status(code.Code).json({
      deleting: true,
    });
  }

  async VerifyExistGameId(id: string): Promise<boolean> {
    if (!isObjectId(id)) return false;
    let game = await this.db.game.findFirst({
      where: {
        id,
      },
    });

    return game !== null;
  }

  async VerifyExistUserId(id: string): Promise<boolean> {
    if (!isObjectId(id)) return false;
    let user = await this.db.user.findFirst({
      where: {
        id,
      },
    });

    return user !== null;
  }

  async VerifyExistUserBoostersId(id: string): Promise<boolean> {
    if (!isObjectId(id)) return false;

    let userBooster = await this.db.userBooster.findFirst({
      where: {
        id,
      },
    });

    return userBooster !== null;
  }
}

import Controller from "@/controllers/controller";
import SubController from "@/controllers/sub-controller";
import {
  BadRequestError,
  NoContentError,
  NotAcceptableError,
} from "@/errorManager";
import { HttpStatusKeysMore } from "@/types";
import HttpStatusManagement from "@/utils/http-status-management";
import { $Enums, Position } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default class PositionsController extends SubController {
  acceptKeysPost: string[] = [
    "position",
    "increasePercentage",
    "divitions",
    "gameId",
  ];
  increasePercentage = 40;
  constructor(isParams: boolean) {
    super(isParams);
  }

  AddMethods(ctr: Controller): void {
    ctr.addGet(this.GET.bind(this), "positions", $Enums.Role.ADMIN);
    ctr.addGet(this.GETAllbyGame.bind(this), "allbg", $Enums.Role.ADMIN);
    ctr.addPost(this.POST.bind(this), "positions", $Enums.Role.ADMIN);
    ctr.addPatch(this.PATCH.bind(this), "positions", $Enums.Role.ADMIN);
    ctr.addPatch(
      this.PATCHaddDivitions.bind(this),
      "divitions",
      $Enums.Role.ADMIN
    );
    ctr.addDelete(this.DELETE.bind(this), "positions", $Enums.Role.ADMIN);
    ctr.addDelete(
      this.DELETEremoveDivitions.bind(this),
      "divitions",
      $Enums.Role.ADMIN
    );
  }

  async GET(req: NextApiRequest, res: NextApiResponse<any>) {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);
    try {
      if (req.query.id === undefined || Array.isArray(req.query.id)) {
        throw new NotAcceptableError(
          "Need Id Param for this method",
          "Not send Id Param"
        );
      }
      let id = req.query.id;
      const position = await this.db.position.findFirst({
        where: {
          id,
        },
      });
      res.status(code.Code).json({
        code: `(${code.Meaning})`,
        position,
      });
    } catch (error) {}
  }

  async GETAllbyGame(req: NextApiRequest, res: NextApiResponse<any>) {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);
    try {
      if (req.query.id === undefined || Array.isArray(req.query.id)) {
        throw new NotAcceptableError(
          "Need Id Param for this method",
          "Not send Id Param"
        );
      }
      let id = req.query.id;
      const positions = await this.db.position.findMany({
        where: {
          gameId: id,
        },
      });
      const game = await this.db.game.findFirst({
        where: { id },
      });
      res.status(code.Code).json({
        code: `(${code.Meaning})`,
        positions,
        game,
      });
    } catch (error) {}
  }

  async POST(req: NextApiRequest, res: NextApiResponse<any>): Promise<void> {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);
    try {
      if (req.body.gameId) {
        let game = await this.db.game.findFirst({
          where: {
            id: req.body.gameId,
          },
        });
        if (game === null) {
          throw new BadRequestError("Need a Game", "To add Position");
        }
      }
      if (
        req.body.increasePercentage === undefined ||
        req.body.increasePercentage === null ||
        Array.isArray(req.body.increasePercentage)
      ) {
        req.body.increasePercentage = this.increasePercentage;
      }
      if (
        !Object.keys(req.body).every((ke) => this.acceptKeysPost.includes(ke))
      ) {
        throw new BadRequestError("Need all Body", "Add Position to Game");
      }

      const positionCreate = await this.db.position.create({
        data: req.body as Position,
      });

      res.status(code.Code).json({
        position: positionCreate,
      });
    } catch (error) {}
  }

  async PATCH(req: NextApiRequest, res: NextApiResponse<any>): Promise<void> {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);

    if (
      req.query.id === undefined ||
      req.query.id === null ||
      Array.isArray(req.query.id)
    ) {
      throw new BadRequestError("Need Id of Positions", "Update Positions");
    }
    let id = req.query.id;
    const data: Partial<Position> = {
      divitions: req.body.divitions,
      increasePercentage: req.body.increasePercentage,
      position: req.body.position,
    };

    const position = await this.db.position.findFirst({
      where: {
        id,
      },
    });

    if (position === null) {
      throw new BadRequestError(
        "Not Position whit this id",
        "Update Positions"
      );
    }
    const positionCreate = await this.db.position.update({
      where: { id },
      data: {
        ...data,
        gameId: position.gameId,
      },
    });

    res.status(code.Code).json({
      position: positionCreate,
    });
  }

  async PATCHaddDivitions(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);

    if (
      req.query.id === undefined ||
      req.query.id === null ||
      Array.isArray(req.query.id)
    ) {
      throw new BadRequestError(
        "Need Id of Positions",
        "Add Divitions to Positions"
      );
    }
    if (req.body.divitions === undefined || req.body.divitions === null) {
      throw new BadRequestError(
        "Need divitions property",
        "Add Divitions to Positions"
      );
    }
    let id = req.query.id;
    const position = await this.db.position.findFirst({
      where: {
        id,
      },
    });
    if (position === null) {
      throw new NoContentError("No Position", "Whit this Id");
    }
    if (Array.isArray(req.body.divitions)) {
      req.body.divitions.forEach((dv: string) => {
        position.divitions.push(dv);
      });
    } else {
      position.divitions.push(req.body.divitions);
    }

    const positionUpdate = await this.db.position.update({
      where: {
        id,
      },
      data: {
        divitions: position.divitions,
      },
    });

    res.status(code.Code).json({
      positionUpdate,
      update: true,
    });
  }

  async DELETEremoveDivitions(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);

    if (
      req.query.id === undefined ||
      req.query.id === null ||
      Array.isArray(req.query.id)
    ) {
      throw new BadRequestError(
        "Need Id of Positions",
        "Delete Divitions to Positions"
      );
    }
    if (req.body.divitions === undefined || req.body.divitions === null) {
      throw new BadRequestError(
        "Need divitions property",
        "Delete Divitions to Positions"
      );
    }
    let id = req.query.id;
    const position = await this.db.position.findFirst({
      where: {
        id,
      },
    });
    if (position === null) {
      throw new NoContentError("No Position", "Whit this Id");
    }
    if (Array.isArray(req.body.divitions)) {
      position.divitions = position.divitions.filter(
        (uk) => !req.body.divitions.includes(uk)
      );
      //   req.body.divitions.forEach((dv: string) => {
      //   position.divitions.push(dv);
      // });
    } else {
      position.divitions = position.divitions.filter(
        (uk) => uk !== req.body.divitions
      );
    }

    const positionUpdate = await this.db.position.update({
      where: {
        id,
      },
      data: {
        divitions: position.divitions,
      },
    });

    res.status(code.Code).json({
      positionUpdate,
      update: true,
    });
  }

  async DELETE(req: NextApiRequest, res: NextApiResponse<any>): Promise<void> {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);

    if (
      req.query.id === undefined ||
      req.query.id === null ||
      Array.isArray(req.query.id)
    ) {
      throw new BadRequestError("Need Id of Positions", "Delete Positions");
    }
    let id = req.query.id;

    await this.db.position.delete({
      where: {
        id,
      },
    });

    res.status(code.Code).json({
      delete: true,
    });
  }
}

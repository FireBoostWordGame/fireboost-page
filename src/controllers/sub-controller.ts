import Controller from "./controller";

export default abstract class SubController extends Controller {
  constructor(isParams: boolean) {
    super(isParams);
  }
  abstract AddMethods(ctr: Controller): void;
}

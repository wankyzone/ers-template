import { Router, type NextFunction, type Request, type Response } from "express";
import {
  acceptTaskHandler,
  completeTaskHandler,
  createTaskHandler,
  getTaskHandler,
  listTasksHandler,
} from "../controllers/taskController";

const router = Router();

type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

const asyncHandler =
  (handler: AsyncRouteHandler) =>
  (req: Request, res: Response, next: NextFunction) => {
    void handler(req, res, next).catch(next);
  };

router.get("/", asyncHandler(listTasksHandler));
router.post("/", asyncHandler(createTaskHandler));
router.get("/:id", asyncHandler(getTaskHandler));
router.patch("/:id/accept", asyncHandler(acceptTaskHandler));
router.patch("/:id/complete", asyncHandler(completeTaskHandler));

export default router;

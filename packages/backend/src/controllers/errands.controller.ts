import {  Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import {
  createErrandService,
  acceptErrandService,
  startErrandService,
  completeErrandService,
  getClientErrandsService,
} from "../services/errand.service";
import { getAvailableErrandsForRunnerService } from "../services/errand.service";


function requireUser(req: Request) {
  const user = req.user;
  if (!user) throw Object.assign(new Error("Unauthorized"), { statusCode: 401 });
  return user;
}

function requireParam(param: unknown, name: string) {
  if (typeof param !== "string" || !param) {
    throw Object.assign(new Error(`Invalid param: ${name}`), { statusCode: 400 });
  }
  return param;
}


/**
 * CLIENT — create errand
 */
export const createErrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = requireUser(req);

    const errand = await createErrandService(
      user.id,
      user.role,
      req.body.title,
      req.body.description
    );

    return res.status(201).json({ errand });
  } catch (err) {
    return next(err);
  }
};


/**
 * RUNNER — accept errand
 */
export async function acceptErrand(req: Request, res: Response, next: NextFunction) {
  try {
    const user = requireUser(req);
    const errandId = requireParam(req.params.id, "id");

    const errand = await acceptErrandService(user.id, user.role, errandId);
    return res.json({ errand });
  } catch (err) {
    return next(err);
  }
}


/**
 * RUNNER — start errand
 */
export async function startErrand(req: Request, res: Response, next: NextFunction) {
  try {
    const user = requireUser(req);
    const errandId = requireParam(req.params.id, "id");

    const errand = await startErrandService(user.id, errandId);
    return res.json({ errand });
  } catch (err) {
    return next(err);
  }
}


/**
 * RUNNER — complete errand
 */
export async function completeErrand(req: Request, res: Response, next: NextFunction) {
  try {
    const user = requireUser(req);
    const errandId = requireParam(req.params.id, "id");

    const errand = await completeErrandService(user.id, errandId);
    return res.json({ errand });
  } catch (err) {
    return next(err);
  }
}


/**
 * CLIENT — get own errands
 */

export async function getClientErrands(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const clientId = req.user.id;
  res.json({ errands: [] });
}

export async function getAvailableErrandsForRunner(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const runnerId = req.get("x-runner-id");

    if (!runnerId) {
      return res.status(400).json({ error: "x-runner-id required" });
    }

    const errands = await getAvailableErrandsForRunnerService(runnerId);

    res.json({ errands });
  } catch (err) {
    next(err);
  }
}

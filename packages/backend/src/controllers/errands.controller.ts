import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/authenticated-request";
import { AppError } from "../utils/AppError";
import {
  createErrandService,
  acceptErrandService,
  startErrandService,
  completeErrandService,
  getClientErrandsService,
} from "../services/errand.service"; 

/**
 * CLIENT — create errand
 */
export const createErrand = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const errand = await createErrandService(
      req.user.id,
      req.user.role,
      req.body.title,
      req.body.description
    );

    res.status(201).json({ errand });
  } catch (err) {
    next(err);
  }
};

/**
 * RUNNER — accept errand
 */
export const acceptErrand = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const errand = await acceptErrandService(
      req.user.id,
      req.user.role,
      req.params.id
    );

    res.json(errand);
  } catch (err) {
    next(err);
  }
};

/**
 * RUNNER — start errand
 */
export const startErrand = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const errand = await startErrandService(
      req.user.id,
      req.params.id
    );

    res.json(errand);
  } catch (err) {
    next(err);
  }
};

/**
 * RUNNER — complete errand
 */
export const completeErrand = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const errand = await completeErrandService(
      req.user.id,
      req.params.id
    );

    res.json(errand);
  } catch (err) {
    next(err);
  }
};

/**
 * CLIENT — get own errands
 */
export const getClientErrands = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const errands = await getClientErrandsService(req.user.id);
    res.json({ errands });
  } catch (err) {
    next(err);
  }
};

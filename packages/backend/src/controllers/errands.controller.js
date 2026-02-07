"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErrand = void 0;
exports.acceptErrand = acceptErrand;
exports.startErrand = startErrand;
exports.completeErrand = completeErrand;
exports.getClientErrands = getClientErrands;
exports.getAvailableErrandsForRunner = getAvailableErrandsForRunner;
const errand_service_1 = require("../services/errand.service");
const errand_service_2 = require("../services/errand.service");
function requireUser(req) {
    const user = req.user;
    if (!user)
        throw Object.assign(new Error("Unauthorized"), { statusCode: 401 });
    return user;
}
function requireParam(param, name) {
    if (typeof param !== "string" || !param) {
        throw Object.assign(new Error(`Invalid param: ${name}`), { statusCode: 400 });
    }
    return param;
}
/**
 * CLIENT — create errand
 */
const createErrand = async (req, res, next) => {
    try {
        const user = requireUser(req);
        const errand = await (0, errand_service_1.createErrandService)(user.id, user.role, req.body.title, req.body.description);
        return res.status(201).json({ errand });
    }
    catch (err) {
        return next(err);
    }
};
exports.createErrand = createErrand;
/**
 * RUNNER — accept errand
 */
async function acceptErrand(req, res, next) {
    try {
        const user = requireUser(req);
        const errandId = requireParam(req.params.id, "id");
        const errand = await (0, errand_service_1.acceptErrandService)(user.id, user.role, errandId);
        return res.json({ errand });
    }
    catch (err) {
        return next(err);
    }
}
/**
 * RUNNER — start errand
 */
async function startErrand(req, res, next) {
    try {
        const user = requireUser(req);
        const errandId = requireParam(req.params.id, "id");
        const errand = await (0, errand_service_1.startErrandService)(user.id, errandId);
        return res.json({ errand });
    }
    catch (err) {
        return next(err);
    }
}
/**
 * RUNNER — complete errand
 */
async function completeErrand(req, res, next) {
    try {
        const user = requireUser(req);
        const errandId = requireParam(req.params.id, "id");
        const errand = await (0, errand_service_1.completeErrandService)(user.id, errandId);
        return res.json({ errand });
    }
    catch (err) {
        return next(err);
    }
}
/**
 * CLIENT — get own errands
 */
async function getClientErrands(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const clientId = req.user.id;
    res.json({ errands: [] });
}
async function getAvailableErrandsForRunner(req, res, next) {
    try {
        const runnerId = req.get("x-runner-id");
        if (!runnerId) {
            return res.status(400).json({ error: "x-runner-id required" });
        }
        const errands = await (0, errand_service_2.getAvailableErrandsForRunnerService)(runnerId);
        res.json({ errands });
    }
    catch (err) {
        next(err);
    }
}

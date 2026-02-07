"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERRAND_TRANSITIONS = void 0;
exports.ERRAND_TRANSITIONS = {
    open: ["accepted"],
    accepted: ["in_progress"],
    in_progress: ["completed"],
    completed: [],
};

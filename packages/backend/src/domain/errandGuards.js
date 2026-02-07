"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertValidTransition = assertValidTransition;
const errandStatus_1 = require("./errandStatus");
function assertValidTransition(from, to) {
    const allowed = errandStatus_1.ERRAND_TRANSITIONS[from] ?? [];
    if (!allowed.includes(to)) {
        throw new Error(`Invalid errand transition: ${from} → ${to}`);
    }
}

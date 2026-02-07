"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_1 = require("../supabase");
const router = (0, express_1.Router)();
// Record payment
router.post("/", async (req, res) => {
    const { errand_id, client_id, runner_id, amount } = req.body;
    const { data, error } = await supabase_1.supabase
        .from("payments")
        .insert([{ errand_id, client_id, runner_id, amount }])
        .select();
    if (error)
        return res.status(400).json({ error: error.message });
    res.json(data[0]);
});
// Get payments
router.get("/", async (req, res) => {
    const { data, error } = await supabase_1.supabase.from("payments").select("*");
    if (error)
        return res.status(400).json({ error: error.message });
    res.json(data);
});
exports.default = router;

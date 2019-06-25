import express from "express";

import User from "../../models/User";

const router = express.Router();

/************************************************************
 * Type    : GET
 * Routes  : api/users/test
 * Desc    : To test the user route is working.
 * Access  : Public
 * Params  : N/A
************************************************************* */
router.get("/test", (req, res) =>
    res.json({
        msg: "Users works"
    })
);

export default router;

import express from "express";
import * as Reward from "./reward-controller";

const router = express.Router();

// Dummy route to see how it works
router.get("/hello", Reward.dummyTest);

export default router;

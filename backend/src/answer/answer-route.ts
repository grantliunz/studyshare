import express from "express";
import * as Answer from "./answer-controller";

const router = express.Router();

// Dummy route to see how it works
router.get("/hello", Answer.dummyTest);

export default router;

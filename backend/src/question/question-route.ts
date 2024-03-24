import express from "express";
import * as Question from "./question-controller";

const router = express.Router();

// Dummy route to see how it works
router.get("/hello", Question.dummyTest);

export default router;

import express from "express";
import * as Answer from "./answer-controller";

const router = express.Router();

// CRUD operations for answers
router.post("/createAnswer/:questionId", Answer.createAnswer);
router.get("/getAllAnswers/:questionId", Answer.getAllAnswers);
router.get("/getAnswer/:answerId", Answer.getAnswer);
router.put("/updateAnswer/:answerId", Answer.updateAnswer);
router.delete("/deleteAnswer/:answerId", Answer.deleteAnswer);


export default router;

import express from "express";
import * as Question from "./question-controller";

const router = express.Router();

router.post("/createQuestion/:AssessmentId", Question.createQuestion);
router.get("/getAllQuestions/:AssessmentId", Question.getAllQuestions);
router.get("/getQuestion/:id", Question.getQuestion);
router.put("/updateQuestion/:id", Question.updateQuestion);
router.delete("/deleteQuestion/:id", Question.deleteQuestion);


export default router;

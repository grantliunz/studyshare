import express from "express";

const router = express.Router();

// Import routers
import userRouter from "../user/user-route";
import questionRouter from "../question/question-route";
import answerRouter from "../answer/answer-route";
import universityRouter from "../university/university-route";

// Use routers
router.use("/user", userRouter);
router.use("/question", questionRouter);
router.use("/answer", answerRouter);
router.use("/university", universityRouter);


export default router;

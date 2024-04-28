import express from 'express';

const router = express.Router();

// Import routers
import userRouter from '../user/user-route';
import questionRouter from '../question/question-route';
import answerRouter from '../answer/answer-route';
import universityRouter from '../university/university-route';
import courseRouter from '../course/course-route';
import assessmentRouter from '../assessment/assessment-route';

// Use routers
router.use('/user', userRouter);
router.use('/question', questionRouter);
router.use('/answer', answerRouter);
router.use('/university', universityRouter);
router.use('/course', courseRouter);
router.use('/assessment', assessmentRouter);

export default router;

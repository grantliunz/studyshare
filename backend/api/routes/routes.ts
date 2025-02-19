import express, { Request, Response } from 'express';

const router = express.Router();

// Import routers
import userRouter from './user/user-route';
import questionRouter from './question/question-route';
import answerRouter from './answer/answer-route';
import universityRouter from './university/university-route';
import courseRouter from './course/course-route';
import assessmentRouter from './assessment/assessment-route';
import commentRouter from './comment/comment-route';

// Use routers
router.use('/user', userRouter);
router.use('/question', questionRouter);
router.use('/comment', commentRouter);
router.use('/answer', answerRouter);
router.use('/university', universityRouter);
router.use('/course', courseRouter);
router.use('/assessment', assessmentRouter);

router.get('/', (_req: Request, res: Response) => {
  res.status(201).json({ message: 'Welcome to StudyShare' });
});

export default router;

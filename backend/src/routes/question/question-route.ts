import express from 'express';
import * as Question from './question-controller';

const router = express.Router();

router.post('/createQuestion/:assessmentId', Question.createQuestion);
router.get('/getAllQuestions/:assessmentId', Question.getAllQuestions);
router.get('/getQuestion/:id', Question.getQuestion);
router.put('/updateQuestion/:id', Question.updateQuestion);
router.delete('/deleteQuestion/:id', Question.deleteQuestion);
router.put('/createVersion/:id', Question.newVersion);

export default router;

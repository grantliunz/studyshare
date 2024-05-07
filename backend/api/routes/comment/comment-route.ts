import express from 'express';
import * as Comment from './comment-controller';

const router = express.Router();

router.post('/createComment/:answerId', Comment.createComment);
router.get('/getAllComments/:answerId', Comment.getAllComments);
router.get('/getComment/:commentId', Comment.getComment);
router.put('/updateComment/:commentId', Comment.updateComment);
router.delete('/deleteComment/:commentId', Comment.deleteComment);
router.post('/voteComment/:commentId', Comment.voteComment);

export default router;

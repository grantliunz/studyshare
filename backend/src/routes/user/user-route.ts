import express from 'express';
import * as User from './user-controller';

const router = express.Router();

router.post('/createUser', User.createUser);
router.get('/getAllUsers', User.getAllUsers);
router.get('/getUser/:userId', User.getUser);
router.put('/updateUser/:userId', User.updateUser);
router.delete('/deleteUser/:userId', User.deleteUser);

export default router;

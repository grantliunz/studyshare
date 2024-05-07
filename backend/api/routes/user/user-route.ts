import express from 'express';
import * as User from './user-controller';

const router = express.Router();

router.post('/createUser', User.createUser);
router.get('/getAllUsers', User.getAllUsers);
router.get('/getUser/:userId', User.getUser);
router.get('/getNotifications/:userId', User.getNotifications);
router.get('/getProfile/:userId', User.getProfile);
router.put('/updateUser/:userId', User.updateUser);
router.delete('/deleteUser/:userId', User.deleteUser);
router.put('/updateWatchList/:userId', User.updateWatchList);
router.put('/updateReported/:userId', User.updateReported);

export default router;

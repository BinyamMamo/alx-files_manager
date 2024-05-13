// eslint-disable-next-line no-unused-vars
import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
// import AuthController from '../controllers/AuthController';

const router = express.Router();

router
  .get('/status', AppController.getStatus)
  .get('/stats', AppController.getStats)
  .post('/users', UsersController.postNew);
// .get('/connect', AuthController.getConnect)
// .get('/disconnect', AuthController.getDisconnect)
// .get('/users/me', UsersController.getMe);

export default router;

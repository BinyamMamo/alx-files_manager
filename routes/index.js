import { Router } from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

const router = Router();

router
  .get('/status', AppController.getStatus)
  .get('/stats', AppController.getStats)
  .post('/users', UsersController.postNew);

export default router;

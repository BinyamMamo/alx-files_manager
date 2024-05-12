#!/usr/bin/node
import { Router } from 'express';
import { AppController } from '../controllers/AppController';

const router = Router();

router.get('/status', AppController.getStatus)
  .get('/stats', AppController.getStats);

module.exports = router;

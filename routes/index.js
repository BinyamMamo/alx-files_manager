#!/usr/bin/node

const express = require('express');
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');
const FilesController = require('../controllers/FilesController');

const router = express.Router();

router.get('/status', AppController.getStatus)
  .get('/stats', AppController.getStats)
  .post('/users', UsersController.postNew)
  .get('/users', UsersController.getUsers)
  .get('/connect', AuthController.getConnect)
  .get('/disconnect', AuthController.getDisconnect)
  .get('/users/me', UsersController.getMe)
  .post('/files', FilesController.postUpload);

module.exports = router;

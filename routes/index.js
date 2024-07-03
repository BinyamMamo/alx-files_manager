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
  .post('/files', FilesController.postUpload)
  .get('/files/:id', FilesController.getShow)
  .get('/files/:id/data', FilesController.getFile)
  .put('/files/:id/publish', FilesController.putPublish)
  .put('/files/:id/unpublish', FilesController.putUnpublish)
  .get('/files', FilesController.getIndex);

module.exports = router;

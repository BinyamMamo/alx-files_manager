#!/usr/bin/node

const { v4 } = require('uuid');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');
const { getAuthzHeader, getToken, pwdHashed } = require('../utils/helpers');
const { decodeToken, getCredentials } = require('../utils/helpers');

const getConnect = async (req, res) => {
  const authzHeader = getAuthzHeader(req);
  if (!authzHeader) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const token = getToken(authzHeader);
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const decodedToken = decodeToken(token);
  if (!decodedToken) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const { email, password } = getCredentials(decodedToken);
  const user = await dbClient.getUser(email);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  if (user.password !== pwdHashed(password)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const accessToken = v4();
  await redisClient.set(`auth_${accessToken}`, user._id.toString('utf8'), 60 * 60 * 24);
  res.json({ token: accessToken });
  res.end();
}

const getDisconnect = async (req, res) => {
  const token = req.headers['x-token'];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const id = await redisClient.get(`auth_${token}`);
  if (!id) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const user = await dbClient.getUserById(id);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  await redisClient.del(`auth_${token}`);
  res.status(204).end();
}

const getMe = async (req, res) => {
  const token = req.headers['x-token'];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const id = await redisClient.get(`auth_${token}`);
  if (!id) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const user = await dbClient.getUserById(id);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  res.json({ id: user._id, email: user.email }).end();
}

module.exports = {
  getConnect,
  getDisconnect,
  getMe,
};
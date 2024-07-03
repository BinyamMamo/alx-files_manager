#!/usr/bin/node

const sha1 = require('sha1');
const redisClient = require('../utils/redis');

const pwdHashed = (pwd) => sha1(pwd);

const getUserId = async (req) => {
  const token = req.headers['x-token'];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    throw new Error('token not found');
  }

  const key = `auth_${token}`;

  let userId = await redisClient.get(key);
  return userId;
};

const getCredentials = (decodedToken) => {
  const [email, password] = decodedToken.split(':');
  if (!email || !password) {
    return null;
  }
  return { email, password };
};

module.exports = {
  pwdHashed,
  getCredentials,
  getUserId,
};

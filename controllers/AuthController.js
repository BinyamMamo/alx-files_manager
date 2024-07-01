#!/usr/bin/node

const sha1 = require('sha1');
const { v4: uuidv4 } = require('uuid');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

const getConnect = async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      res.status(401).json({ error: 'Unauthorized' });
      throw new Error('Unauthorized');
    }

    const encoded = auth.split(' ')[1];
    const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
    if (!decoded.includes(':')) {
      res.status(401).json({ error: 'Unauthorized' });
      throw new Error('Unauthorized');
    }

    const [email, password] = decoded.split(':');
    const user = await dbClient.getUser(email);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      throw new Error('No user found');
    }

    if (user.password !== sha1(password)) throw new Error('Incorrect password');

    const token = uuidv4();
    const key = `auth_${token}`;
    redisClient.set(key, user._id, 24 * 3600);
    res.status(200).json({ token });
  } catch (err) {
    console.log(`Authentication Error: ${err.message}`);
  }
};

const getDisconnect = async (req, res) => {
  try {
    const token = req.headers['x-token'];
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      throw new Error('token not found');
    }

    const key = `auth_${token}`;
    const userID = await redisClient.get(key);

    const user = await dbClient.getUserById(userID);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      throw new Error('user not found');
    }

    await redisClient.del(key);
    res.status(204).end();
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
};

module.exports = {
  getConnect,
  getDisconnect,
};

#!/usr/bin/node

const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

function getStatus(req, res) {
  res.status(200).json({
    redis: redisClient.isAlive(),
    db: dbClient.isAlive(),
  });
}

async function getStats(req, res) {
  try {
    const users = await dbClient.nbUsers();
    const files = await dbClient.nbFiles();
    res.status(200).json({ users, files });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'couldn\'t get stats' });
  }
}

module.exports = {
  getStatus,
  getStats,
};

#!/usr/bin/node
import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.connected = true;

    this.client.on('error', (err) => {
      console.error(err);
      this.connected = false;
    }).on('connect', () => {
      this.connected = true;
    });
  }

  isAlive() {
    // return this.client.connected;
    return this.connected;
  }

  async get(key) {
    return promisify(this.client.get).bind(this.client)(key);
  }

  async set(key, value, duration) {
    const setAsync = promisify(this.client.set).bind(this.client);
    return setAsync(key, value, 'EX', duration);
  }

  async del(key) {
    try {
      // await this.client.del(key);
      await promisify(this.client.del).bind(this.client)(key);
    } catch (err) {
      throw new Error('Error deleting values from Redis.');
    }
  }
}

const redisClient = new RedisClient();

export default redisClient;

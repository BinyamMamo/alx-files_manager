#!/usr/bin/node
const { MongoClient } = require('mongodb');
require('dotenv').config();

class DBClient {
  constructor() {
    this.connected = false;

    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const db = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}/${db}`;

    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.client.connect().then(() => {
      this.connected = true;
    }).catch((err) => {
      console.log(err.message);
      this.connected = false;
    });
  }

  isAlive() {
    return this.connected;
  }

  async nbUsers() {
    try {
      const users = this.client.db().collection('users');
      const count = await users.countDocuments();
      return count;
    } catch (err) {
      throw new Error(`Couldn't display number of 'users': ${err}`);
    }
  }

  async nbFiles() {
    try {
      const files = this.client.db().collection('files');
      const count = await files.countDocumets();
      return count;
    } catch (err) {
      throw new Error(`Couldn't display number of 'files': ${err}`);
    }
  }
}

const dbClient = new DBClient();
module.exports = dbClient;

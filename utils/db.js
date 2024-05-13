#!/usr/bin/node
import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    this.connected = false;
    this.db = null;

    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const dbName = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}/${dbName}`;

    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.client.connect().then(() => {
      this.connected = true;
      this.db = this.client.db();
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
      const count = await files.countDocuments();
      return count;
    } catch (err) {
      throw new Error(`Couldn't display number of 'files': ${err}`);
    }
  }

  async closeDB() {
    try {
      await this.client.close();
    } catch (err) {
      console.log(`Unable to close the database: ${err}`);
    }
  }
}

const dbClient = new DBClient();
module.exports = dbClient;

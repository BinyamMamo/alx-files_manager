#!/usr/bin/node

const mongo = require('mongodb');
const { pwdHashed } = require('./helpers');

class DBClient {
  constructor() {
    this.connected = false;

    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const dbName = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}/${dbName}`;

    this.database = dbName;
    this.client = new mongo.MongoClient(url, { useUnifiedTopology: true });
    this.client
      .connect()
      .then(() => {
        this.connected = true;
      })
      .catch((err) => {
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

  async createFile(data) {
    await this.client.connect();
    const file = await this.client
      .db(this.database)
      .collection('files')
      .insertOne(data);
    return file;
  }

  async getFile(id) {
    try {
      const _id = new mongo.ObjectID(id);
      await this.client.connect();
      const file = await this.client
        .db(this.database)
        .collection('files')
        .findOne({ _id });

      return file;
    } catch (err) {
      throw new Error(`Getting a FIle(${id}): ${err.message}`);
    }
  }

  async getFiles(match, skip, limit) {
    let files = [];
    try {
      await this.client.connect();
      files = await this.client
        .db(this.database)
        .collection('files')
        .aggregate([
          {
            $match: match,
          },
          { $sort: { _id: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 0,
              id: '$_id',
              userId: '$userId',
              name: '$name',
              type: '$type',
              isPublic: '$isPublic',
              parentId: {
                $cond: {
                  if: { $eq: ['$parentId', '0'] },
                  then: 0,
                  else: '$parentId',
                },
              },
            },
          },
        ])
        .toArray();
    } catch (err) {
      console.error(err);
    }
    return files;
  }

  async updateFile(filter, update) {
    try {
      await this.client.connect();
      const file = await this.client
        .db(this.database)
        .collection('files')
        .updateOne(filter, { $set: update });

      return file;
    } catch (err) {
      console.error(err);
      return null;
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

  async createUser(email, password) {
    const hashedPwd = pwdHashed(password);
    await this.client.connect();
    const user = await this.client
      .db(this.database)
      .collection('users')
      .insertOne({ email, password: hashedPwd });
    return user;
  }

  async getUsers() {
    try {
      await this.client.connect();
      const users = await this.client
        .db(this.database)
        .collection('users')
        .find({})
        .toArray();
      // this.client.close();
      return users;
    } catch (err) {
      throw new Error(`Getting users: ${err.message}`);
    }
  }

  async getUser(email) {
    try {
      await this.client.connect();
      const user = await this.client
        .db(this.database)
        .collection('users')
        .find({ email })
        .toArray();
      if (!user.length) {
        return null;
      }
      return user[0];
    } catch (err) {
      throw new Error(`Getting a user(${email}): ${err.message}`);
    }
  }

  async getUserById(id) {
    const _id = new mongo.ObjectID(id);
    await this.client.connect();
    const user = await this.client
      .db(this.database)
      .collection('users')
      .findOne({ _id });
    return user;
  }

  async userExist(email) {
    const user = await this.getUser(email);
    if (user) {
      return true;
    }
    return false;
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

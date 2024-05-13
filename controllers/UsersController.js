#!/usr/bin/node
import bcrypt from 'bcrypt';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(req, res) {
    try {
      const { email, password } = req.body;

      if (!email) { throw new Error({ status: 400, message: 'Missing email' }); }
      if (!password) { throw new Error({ status: 400, message: 'Missing password' }); }
      const users = dbClient.client.db().collection('users');
      const user = await users.findOne({ email });

      if (user) throw new Error({ status: 400, message: 'Already exist' });

      const salt = await bcrypt.genSalt(10);
      const hashed_password = await bcrypt.hash(password, salt);

      const newUser = await users.insertOne({
        email,
        password: hashed_password,
      });

      res.status(201).json({ id: newUser.insertedId, email });
    } catch (err) {
      res.status(err.status).json(err);
      throw new Error(`Unable to create user ${err}`);
    }
  }
}

module.exports = UsersController;

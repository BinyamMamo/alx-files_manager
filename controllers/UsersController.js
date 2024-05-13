#!/usr/bin/node
import bcrypt from 'bcrypt';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(req, res) {
    try {
      const { email, password } = req.body;

      if (!email) {
        res.status(400).json({ error: 'Missing email' });
        throw new Error('Missing email');
      }
      if (!password) {
        res.status(400).json({ error: 'Missing password' });
        throw new Error('Missing password');
      }

      const users = dbClient.client.db().collection('users');
      const user = await users.findOne({ email });

      if (user) {
        res.status(400).json({ error: 'Already exists' });
        throw new Error('Already exist');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await users.insertOne({
        email,
        password: hashedPassword,
      });

      res.status(201).json({ id: newUser.insertedId, email });
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = UsersController;

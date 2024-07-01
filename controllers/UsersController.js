const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

const postNew = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Missing email' });
    return;
  }
  if (!password) {
    res.status(400).json({ error: 'Missing password' });
    return;
  }
  const userExist = await dbClient.userExist(email);
  if (userExist) {
    res.status(400).json({ error: 'Already exist' });
    return;
  }
  const user = await dbClient.createUser(email, password);
  const id = `${user.insertedId}`;
  res.status(201).json({ id, email });
};

const getUsers = async (req, res) => {
  try {
    const users = await dbClient.getUsers();
    res.status(200).json(users);
  } catch (err) { throw new Error(err.message); }
};

const getMe = async (req, res) => {
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

    const { email, _id } = user;
    res.status(200).json({ email, id: _id });
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
};

module.exports = {
  postNew,
  getUsers,
  getMe,
};

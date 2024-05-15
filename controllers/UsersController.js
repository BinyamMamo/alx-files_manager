const dbClient = require('../utils/db');

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

module.exports = {
  postNew,
};

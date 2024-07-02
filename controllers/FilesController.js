const util = require('util');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

const FILE_TYPES = {
  folder: 'folder',
  file: 'file',
  image: 'image',
};

const mkDirAsync = util.promisify(fs.mkdir);
const writeFileAsync = util.promisify(fs.writeFile);

const postUpload = async (req, res) => {
  try {
    const token = req.headers['x-token'];
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      throw new Error('token not found');
    }

    const key = `auth_${token}`;
    const userId = await redisClient.get(key);

    const user = await dbClient.getUserById(userId);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      throw new Error('user not found');
    }

    const {
      name, type, parentId, isPublic, data,
    } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Missing name' });
      throw new Error('Missing name');
    }

    if (!type || !(type in FILE_TYPES)) {
      res.status(400).json({ error: 'Missing type' });
      throw new Error('Missing type');
    }

    if (!data && type !== 'folder') {
      res.status(400).json({ error: 'Missing data' });
      throw new Error('Missing data');
    }
    if (parentId && parentId !== 0) {
      const parentFile = dbClient.getFile(parentId);
      if (!parentFile) {
        res.status(400).json({ error: 'Parent not found' });
        throw new Error('Parent not found');
      }

      if (parentFile.type !== 'folder') {
        res.status(400).json({ error: 'Parent is not a folder' });
        throw new Error('Parent is not a folder');
      }
    }

    const file = {
      userId,
      name,
      type,
      parentId: parentId || 0,
    };

    if (isPublic) file.isPublic = isPublic || false;

    if (file.type === FILE_TYPES.folder) {
      const holder = await dbClient.createFile(file);
      file.id = holder.insertedId;
      delete file._id;
      res.status(201).json(file);
      return;
    }

    let localPath = process.env.FOLDER_PATH || '/tmp/files_manager';
    localPath = localPath.trim();
    await mkDirAsync(localPath, { recursive: true });

    localPath = path.join(localPath, uuidv4());
    file.localPath = localPath;
    await writeFileAsync(localPath, Buffer.from(data, 'base64'));

    const holder = await dbClient.createFile(file);
    file.id = holder.insertedId;

    delete file._id;
    res.status(201).json(file);
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
};

module.exports = {
  postUpload,
};

const util = require('util');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const mongoDBCore = require('mongodb/lib/core');
const { contentType } = require('mime-types');
const dbClient = require('../utils/db');
const { getUserId } = require('../utils/helpers');

const FILE_TYPES = {
  folder: 'folder',
  file: 'file',
  image: 'image',
};

const MAX_FILES_PER_PAGE = 20;

const mkDirAsync = util.promisify(fs.mkdir);
const writeFileAsync = util.promisify(fs.writeFile);
const realpathAsync = util.promisify(fs.realpath);

const postUpload = async (req, res) => {
  try {
    const userId = await getUserId(req);

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
      parentId: parentId || '0',
    };

    if (isPublic) file.isPublic = isPublic || false;

    if (file.type === FILE_TYPES.folder) {
      const holder = await dbClient.createFile(file);
      file.id = holder.insertedId;
      delete file._id;
      file.parentId = parentId || 0;
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
    file.parentId = parentId || 0;
    res.status(201).json(file);
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
};

const getShow = async (req, res) => {
  try {
    console.clear();
    const fileId = req.params.id;
    const userId = await getUserId(req);

    const user = await dbClient.getUserById(userId);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      throw new Error('Unauthorized User');
    }

    const file = await dbClient.getFile(fileId);
    if (!file) {
      res.status(401).json({ error: 'Unauthorized' });
      throw new Error('Unauthorized');
    }

    if (file.userId !== userId) {
      res.status(404).json({ error: 'Not found' });
      throw new Error('file not found');
    }

    res.status(200).json(file);
  } catch (err) {
    console.error(err);
  }
};

const getIndex = async (req, res) => {
  try {
    const parentId = req.query.parentId || '0';
    const page = req.query.page || 0;

    const userId = await getUserId(req);
    const user = await dbClient.getUserById(userId);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized User' });
      throw new Error('Unauthorized User');
    }

    const match = {
      userId: new mongoDBCore.BSON.ObjectID(user._id),
      parentId:
        parentId === '0' ? parentId : new mongoDBCore.BSON.ObjectId(parentId),
    };

    const skip = page * MAX_FILES_PER_PAGE;
    const limit = MAX_FILES_PER_PAGE;

    const files = await dbClient.getFiles(match, skip, limit);
    res.status(200).json(files);
  } catch (err) {
    console.error(err);
  }
};

const getFile = async (req, res) => {
  try {
    const size = req.params.size || null;
    const fileId = req.params.id;
    const userId = await getUserId(req);

    const user = await dbClient.getUserById(userId);
    const file = await dbClient.getFile(fileId);
    if (!file) {
      res.status(404).json({ error: 'Not found' });
      throw new Error('file not found');
    }

    if (!file.isPublic && (!user || file.userId !== userId)) {
      res.status(404).json({ error: 'Not found' });
      throw new Error('file not found');
    }

    if (file.type === 'folder') {
      res.status(400).json({ error: "A folder doesn't have content" });
      throw new Error("A folder doesn't have content");
    }

    let filePath = size ? `${file.localPath}_${size}` : file.localPath;
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: 'Not found' });
      throw new Error('file not found');
    }

    filePath = await realpathAsync(filePath);

    res.setHeader(
      'content-Type',
      contentType(file.name) || 'text/plain; charset=utf-8',
    );

    res.status(200).sendFile(filePath);
  } catch (err) {
    console.error(err);
  }
};

const publish = async (req, res, isPublic) => {
  try {
    const fileId = req.params.id;

    const userId = await getUserId(req);
    const user = await dbClient.getUserById(userId);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      throw new Error('Unauthorized');
    }
    const file = await dbClient.getFile(fileId);
    if (!file) {
      res.status(401).json({ error: 'Unauthorized' });
      throw new Error('Unauthorized');
    }

    if (file.userId !== userId) {
      res.status(404).json({ error: 'Not found' });
      throw new Error('file not found');
    }

    const filter = {
      _id: new mongoDBCore.BSON.ObjectId(fileId),
      userId: new mongoDBCore.BSON.ObjectId(userId),
    };

    await dbClient.updateFile(filter, { isPublic });
    const updatedFile = {
      id: fileId,
      userId,
      name: file.name,
      type: file.type,
      isPublic,
      parentId: file.parentId === '0' ? 0 : file.parentId.toString(),
    };
    return updatedFile;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const putPublish = async (req, res) => {
  const updatedFile = await publish(req, res, true);
  res.status(200).json(updatedFile);
};

const putUnpublish = async (req, res) => {
  const updatedFile = await publish(req, res, false);
  res.status(200).json(updatedFile);
};

module.exports = {
  postUpload,
  getShow,
  getIndex,
  getFile,
  putPublish,
  putUnpublish,
};

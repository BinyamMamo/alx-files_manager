#!/usr/bin/node

const sha1 = require('sha1');

const pwdHashed = (pwd) => sha1(pwd);
const getAuthzHeader = (req) => {
  const header = req.headers.authorization;
  if (!header) {
    return null;
  }
  return header;
};

const getToken = (authzHeader) => {
  const tokenType = authzHeader.substring(0, 6);
  if (tokenType !== 'Basic ') {
    return null;
  }
  return authzHeader.substring(6);
};

const decodeToken = (token) => {
  const decodedToken = Buffer.from(token, 'base64').toString('utf8');
  if (!decodedToken.includes(':')) {
    return null;
  }
  return decodedToken;
};

const getCredentials = (decodedToken) => {
  const [email, password] = decodedToken.split(':');
  if (!email || !password) {
    return null;
  }
  return { email, password };
};

class FILE {
  constructor({ userId, name, type, parentId, isPublic, data }) {
    this.userId = userId;
    this.name = name;
    this.type = type;
    this.parentId = parentId;
    this.isPublic = isPublic;
    this.data = data;
  }
}

module.exports = {
  pwdHashed,
  getAuthzHeader,
  getToken,
  decodeToken,
  getCredentials,
  FILE,
};

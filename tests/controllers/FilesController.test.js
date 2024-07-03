const getShow = require('./FilesController')
const dbClient = require('../utils/db')
jest.mock('../utils/db')

describe('getShow', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should return 401 if user is not found', async () => {
    const req = { params: { id: '123' } }
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    dbClient.getUserById.mockResolvedValue(null)
const FilesController = require('./FilesController')
const dbClient = require('../utils/db')
const getUserId = require('../utils/getUserId')

jest.mock('../utils/db')
jest.mock('../utils/getUserId')

describe('FilesController', () => {
  describe('getShow', () => {
    let req, res

    beforeEach(() => {
      req = {
        params: { id: '123' },
      }
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      getUserId.mockResolvedValue('user123')
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('should return 401 if user is not found', async () => {
      dbClient.getUserById.mockResolvedValue(null)

      await FilesController.getShow(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' })
    })

    it('should return 401 if file is not found', async () => {
      dbClient.getUserById.mockResolvedValue({ id: 'user123' })
      dbClient.getFile.mockResolvedValue(null)

      await FilesController.getShow(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' })
    })

    it('should return 404 if file does not belong to user', async () => {
      dbClient.getUserById.mockResolvedValue({ id: 'user123' })
      dbClient.getFile.mockResolvedValue({ userId: 'user456' })

      await FilesController.getShow(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ error: 'Not found' })
    })

    it('should return 200 and file data if user and file are authorized', async () => {
      const file = { id: '123', userId: 'user123', data: 'file data' }
      dbClient.getUserById.mockResolvedValue({ id: 'user123' })
      dbClient.getFile.mockResolvedValue(file)

      await FilesController.getShow(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(file)
    })
  })
})

      expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });    });

    it('should return 401 if user is not found', async () => {
      dbClient.getUserById.mockResolvedValue(null);

      await FilesController.getShow(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('should return 401 if file is not found', async () => {
      dbClient.getUserById.mockResolvedValue({ id: 'user123' });
      dbClient.getFile.mockResolvedValue(null);

      await FilesController.getShow(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('should return 404 if file does not belong to user', async () => {status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  it('should return 401 if file is not found', async () => {
    const req = { params: { id: '123' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const userId = '456';
    dbClient.getUserById.mockResolvedValue({ id: userId });
    dbClient.getFile.mockResolvedValue(null);
Show(req, res);
describe('FilesController.getShow', () => {
  let req, res

  beforeEach(() => {
    req = {
      params: { id: '123' },
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    getUserId.mockResolvedValue('user123')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should return 500 if an error occurs', async () => {
    const error = new Error('Something went wrong')
    dbClient.getUserById.mockRejectedValue(error)

    await FilesController.getShow(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
  })

  it('should return 400 if fileId is invalid', async () => {
    req.params.id = 'invalid'

    await FilesController.getShow(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Bad Request' })
  })

  it('should return 401 if getUserId throws an error', async () => {
    getUserId.mockRejectedValue(new Error('Failed to get user ID'))

    await FilesController.getShow(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' })
  })
})

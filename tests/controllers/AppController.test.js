const AppController = require('../../controllers/AppController')
const dbClient = require('../../utils/db')

jest.mock('../../utils/db')

describe('AppController.getStats', () => {
  let req, res

  beforeEach(() => {
    req = {}
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should return 200 and stats data', async () => {
    const users = 10
    const files = 20
    dbClient.nbUsers.mockResolvedValue(users)
    dbClient.nbFiles.mockResolvedValue(files)

    await AppController.getStats(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ users, files })
  })

  it('should return 500 and error message on error', async () => {
    const error = new Error('Database error')
    dbClient.nbUsers.mockRejectedValue(error)

    await AppController.getStats(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'couldn\'t get stats' })
  })

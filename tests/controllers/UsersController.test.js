describe('UsersController', () => {
  describe('postNew', () => {
    it('should return 400 if email and password are missing', async () => {
      const req = { body: {} }
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
      await postNew(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing email' })
    })

    it('should return 400 if user already exists', async () => {
      const req = { body: { email: 'test@example.com', password: 'password' } }
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
      jest.spyOn(dbClient, 'userExist').mockResolvedValue(true)
      await postNew(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'Already exist' })
    })

    it('should create a new user and add to queue', async () => {
      const req = { body: { email: 'test@example.com', password: 'password' } }
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
      const user = { insertedId: '1234' }
      jest.spyOn(dbClient, 'userExist').mockResolvedValue(false)
      jest.spyOn(dbClient, 'createUser').mockResolvedValue(user)
      jest.spyOn(userQueue, 'add').mockResolvedValue()
      await postNew(req, res)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({ id: '1234', email: 'test@example.com' })
      expect(userQueue.add).toHaveBeenCalledWith({ userId: '1234' })
    })
  })

  describe('getMe', () => {
    it('should return 401 if token is missing', async () => {
      const req = { headers: {} }
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
      await getMe(req, res)
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' })
    })

    it('should return 401 if user is not found', async () => {
      const req = { headers: { 'x-token': 'token' } }
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
      jest.spyOn(redisClient, 'get').mockResolvedValue('1234')
      jest.spyOn(dbClient, 'getUserById').mockResolvedValue(null)
      await getMe(req, res)
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' })
    })

    it('should return user details', async () => {
      const req = { headers: { 'x-token': 'token' } }
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
      const user = { email: 'test@example.com', _id: '1234' }
      jest.spyOn(redisClient, 'get').mockResolvedValue('1234')
      jest.spyOn(dbClient, 'getUserById').mockResolvedValue(user)
      await getMe(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ email: 'test@example.com', id: '1234' })
    })
  })
})

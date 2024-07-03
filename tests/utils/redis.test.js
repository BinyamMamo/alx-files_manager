const Redis = require('../../utils/redis');

describe('redis', () => {
  let redisClient;

  beforeEach(() => {
    redisClient = new Redis();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should set connected to true on successful connection', () => {
    expect.assertions(1);
    const connectMock = jest.fn();
    jest.spyOn(redisClient.client, 'on').mockImplementation().mockReturnValueOnce({
      on: jest.fn().mockReturnValue({ on: connectMock }),
    });

    connectMock();

    expect(redisClient.connected).toBe(true);
  });

  it('should set connected to false on error', () => {
    expect.assertions(1);
    const errorMock = jest.fn();
    jest.spyOn(redisClient.client, 'on').mockImplementation().mockReturnValueOnce({
      on: jest.fn().mockReturnValue({ on: errorMock }),
    });

    errorMock();

    expect(redisClient.connected).toBe(false);
  });
});

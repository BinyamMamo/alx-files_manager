import redisClient from '../utils/redis';
import dbClient from '../utils/db';

/**
 * Controller for managing the application.
 */
export default class AppController {
  /**
   * Get the status of the Redis and DB clients.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} The status of the Redis and DB clients.
   */
  static getStatus(req, res) {
    res.status(200).json({
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    });
  }

  /**
   * Retrieves the statistics of the application.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the
   *   statistics are retrieved and sent as a JSON response.
   */
  static async getStats(req, res) {
    try {
      const users = await dbClient.nbUsers();
      const files = await dbClient.nbFiles();
      res.status(200).json({ users, files });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'couldn\'t get stats' });
    }
  }
}

const request = require('supertest');
const app = require('./index');
const FilesController = require('../controllers/FilesController');

jest.mock('../controllers/FilesController');

describe('gET /files/:id/data', () => {
  it('should call FilesController.getFile with the correct id', async () => {
    expect.assertions(1);
    const fileId = '123';
    const mockGetFile = jest.fn();
    FilesController.getFile.mockImplementation(mockGetFile);

    await request(app).get(`/files/${fileId}/data`);

    expect(mockGetFile).toHaveBeenCalledWith({ params: { id: fileId } });
  });

  it('should return 404 if FilesController.getFile throws an error', async () => {
    expect.hasAssertions();
    const fileId = '123';
    const mockError = new Error('File not found');
    FilesController.getFile.mockRejectedValue(mockError);

    const response = await request(app).get(`/files/${fileId}/data`);

    expect(response.status).toBe(404);
  });
});

const request = require('supertest');
const app = require('../src/app');

describe('auth route validation', () => {
  test('rejects invalid registration payload', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: '',
      email: 'invalid-email',
      password: '123'
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
    expect(Array.isArray(response.body.errors)).toBe(true);
  });
});

const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () =>{
  await db.migrate.rollback();
  await db.migrate.latest();
})

beforeEach(async () =>{
  await db('users').truncate();
})

afterAll(async () =>{
  await db.destroy();
})

describe('server.js', () => {
  describe('login route', () => {
    it('should return a 401 status code when invalid.', async () => {
      const expectedStatusCode = 401;
      const response = await request(server).post('/api/auth/login')
      .send({username: 'dude', password: '1'})
      expect(response.status).toEqual(expectedStatusCode);
    });
    it('Should return expected message when login is invalid', async () => {
      const expectedStatusCode = 401;
      const response = await request(server).post('/api/auth/login')
      .send({username: 'dude', password: '1'})
      expect(response.body).toEqual({message:'invalid credentials'});
    });
  });
  describe('register route', () => {
    it('should return a 401 status code when needed info is missing.', async () => {
      const expectedStatusCode = 401;
      const response = await request(server).post('/api/auth/register');
      expect(response.status).toEqual(expectedStatusCode);
    });
    it('Should return expected message when needed info is missing', async () => {
      const expectedStatusCode = 401;
      const response = await request(server).post('/api/auth/register')
      expect(response.body).toEqual({message: 'username and password required'});
    });
  });
  describe('jokes route', () => {
    it('should return a 401 status code when token is missing.', async () => {
      const expectedStatusCode = 401;
      const response = await request(server).get('/api/jokes');
      expect(response.status).toEqual(expectedStatusCode);
    });
    it('Should return expected message when token is missing', async () => {
      const expectedStatusCode = 401;
      const response = await request(server).post('/api/jokes')
      expect(response.body).toEqual({message: 'token required'});
    });
  });
});
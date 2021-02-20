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
      const response = await request(server).post('/api/auth/login', {username: 'dude', password: '1'});
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
    it('should return a 401 status code when invalid.', async () => {
      const expectedStatusCode = 401;
      const response = await request(server).post('/api/auth/login', {username: 'dude', password: '1'});
      expect(response.status).toEqual(expectedStatusCode);
    });
    it('Should return expected message when login is invalid', async () => {
      const expectedStatusCode = 401;
      const response = await request(server).post('/api/auth/login')
      .send({username: 'dude', password: '1'})
      expect(response.body).toEqual({message:'invalid credentials'});
    });
  });
});
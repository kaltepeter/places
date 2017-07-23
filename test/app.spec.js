const request = require('supertest');
const app = require('../lib/app.js');

describe('Requests to the maps path', () => {
  it('returns a 201 status code for post', (done) => {
    request(app)
    .post('/maps')
    .attach('map', 'test/Great Lakes.kmz')
    .expect(201, done);
  });
});

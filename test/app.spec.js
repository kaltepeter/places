const request = require('supertest');
const app = require('../lib/app');
const Kml = require('../lib/models/kml');
const DB = require('../lib/db');
const fixtures = require('./fixtures/model-kml.json');
const sinon = require('sinon');
require('should-sinon');

describe('Requests to the maps path', () => {
  before(done => {
    DB.connect(DB.MODE_TEST, done);
  });

  beforeEach(done => {
    DB.drop(err => {
      if (err) return done(err);
      DB.fixtures(fixtures, done);
    })
  });

  it('returns a 201 status code for post', (done) => {
    let kml = sinon.spy(Kml, 'create');
    request(app)
      .post('/maps')
      .attach('map', 'test/Great Lakes.kmz')
      .expect(201, (err, res) => {
          if (err) return done(err);
          res.body.id.should.be.String();
          res.body.id.length.should.be.greaterThan(1);
          kml.should.be.calledWith('Great Lakes.kmz', sinon.match(/uploads\/[\d\w]+/));
          done();
      });
  });
});

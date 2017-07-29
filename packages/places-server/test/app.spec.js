const request = require('supertest');
const app = require('../lib/app');
const Kml = require('../lib/models/kml');
const DB = require('../lib/db');
const fixtures = require('./fixtures/model-kml.json');
const sinon = require('sinon');
require('should-sinon');

const uploadMatch = /uploads\/[\d\w]+/;

describe('Requests to the maps path', () => {
  let kmlCreate = sinon.spy(Kml, 'create');
  let kmlFindBy = sinon.spy(Kml, 'findBy');

  before(done => {
    DB.connect(done);
  });

  beforeEach(done => {
    DB.drop(err => {
      if (err) return done(err);
      DB.fixtures(fixtures, done);
    })
  });

  describe('GET /map/:name', () => {
    it('respond with json', (done) => {
      request(app)
        .get('/map/California.kml')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, (err, res) => {
          if (err) return done(err);
          res.body.length.should.eql(1);
          res.body[0].name.should.eql('California.kml');
          res.body[0]._id.should.be.String();
          res.body[0].path.should.match(uploadMatch);
          done();
        });
    });
  });

  it('returns a 201 status code for post', (done) => {
    request(app)
      .post('/maps')
      .attach('map', 'test/Great_Lakes.kmz')
      .expect(201, (err, res) => {
        if (err) return done(err);
        res.body.id.should.be.String();
        res.body.id.length.should.be.greaterThan(1);
        kmlCreate.should.be.calledWith('Great_Lakes.kmz', sinon.match(uploadMatch));
        done();
      });
  });

  it('returns a 404 status code for not found', (done) => {
    request(app)
      .get('/map/bob does not exist.kmz')
      .expect(404, (err, res) => {
        if (err) return done(err);
        kmlFindBy.should.be.calledWith('name', 'bob does not exist.kmz');
        done();
      });
  });
});

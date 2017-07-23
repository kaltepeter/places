const should = require('should');
const DB = require('../../lib/db.js');
const fixtures = require('../fixtures/model-kml.json');
const kml = require('../../lib/models/kml');

describe('Model: kml', () => {

  before(done => {
    DB.connect(DB.MODE_TEST, done);
  });

  beforeEach(done => {
    DB.drop(err => {
      if (err) return done(err);
      DB.fixtures(fixtures, done);
    })
  });

  it('all', (done) => {
    kml.all((err, kml) => {
      kml.length.should.eql(1);
      done();
    });
  });
});

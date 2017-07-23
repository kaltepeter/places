const should = require('should');
const DB = require('../../lib/db.js');
const fixtures = require('../fixtures/model-kml.json');
const Kml = require('../../lib/models/kml');

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
    Kml.all((err, kml) => {
      kml.length.should.eql(2);
      done();
    });
  });

  it('create', (done) => {
    Kml.create('The South', '9e4f2ec12009dab5702e3aff56621e81', (err, id) => {
      Kml.all((err, kml) => {
        kml.length.should.eql(3);
        kml[2]._id.should.eql(id);
        kml[2].name.should.eql('The South');
        kml[2].path.should.eql('9e4f2ec12009dab5702e3aff56621e81');
        done();
      })
    })
  });

  it('remove', (done) => {
    Kml.all((err, kmls) => {
      Kml.remove(kmls[0]._id, (err) => {
        Kml.all((err, result) => {
          result.length.should.eql(1);
          result[0]._id.should.not.eql(kmls[0]._id);
          done();
        })
      })
    })
  });
});

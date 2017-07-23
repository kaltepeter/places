const should = require('should');
const DB = require('../../lib/db');
const fixtures = require('../fixtures/model-kml.json');
const Kml = require('../../lib/models/kml');
const sinon = require('sinon');
require('should-sinon');

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
    Kml.create('The South', 'uploads/9e4f2ec12009dab5702e3aff56621e81', (err, kml) => {
      kml.should.containEql({
        name: 'The South',
        path: 'uploads/9e4f2ec12009dab5702e3aff56621e81'
      });
      Kml.all((err, kmls) => {
        kmls.length.should.eql(3);
        kmls[2]._id.should.eql(kml._id);
        kmls[2].name.should.eql('The South');
        kmls[2].path.should.eql('uploads/9e4f2ec12009dab5702e3aff56621e81');
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

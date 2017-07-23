const should = require('should');
const DB = require('../../lib/db');
const fixtures = require('../fixtures/model-kml.json');
const Kml = require('../../lib/models/kml');
const sinon = require('sinon');
require('should-sinon');

describe('Model: kml', () => {
  let california;
  before(done => {
    DB.connect(DB.MODE_TEST, done);
  });

  beforeEach(done => {
    DB.drop(err => {
      if (err) return done(err);
      DB.fixtures(fixtures, () => {
        DB.getDB().collection('kmls').find({name: 'California.kml'}).toArray((err, docs) => {
          california = docs[0];
          done();
        });
      });
    });
  });

  it('all', (done) => {
    Kml.all((err, kml) => {
      kml.length.should.eql(4);
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
        kmls.length.should.eql(5);
        kmls[4]._id.should.eql(kml._id);
        kmls[4].name.should.eql('The South');
        kmls[4].path.should.eql('uploads/9e4f2ec12009dab5702e3aff56621e81');
        done();
      })
    })
  });

  it('remove', (done) => {
    Kml.all((err, kmls) => {
      Kml.remove(kmls[0]._id, (err) => {
        Kml.all((err, result) => {
          result.length.should.eql(3);
          result[0]._id.should.not.eql(kmls[0]._id);
          done();
        })
      })
    })
  });

  it('find', (done) => {
    Kml.find(california._id, (err, kml) => {
      kml[0].name.should.eql('California.kml');
      done();
    });
  });

  it('findByName', (done) => {
    Kml.findBy('name', 'East Coast.kml', (err, kml) => {
      kml[0].name.should.eql('East Coast.kml');
      done();
    });
  });
});

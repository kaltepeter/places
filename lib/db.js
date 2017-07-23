const MongoClient = require('mongodb').MongoClient;
const async = require('async');

const state = {
  db: null,
  mode: null,
};

// In the real world it will be better if the production uri comes
// from an environment variable, instead of being hard coded.
const PRODUCTION_URI = 'mongodb://127.0.0.1:27017/production';
const TEST_URI = 'mongodb://127.0.0.1:27017/test';

exports.MODE_TEST = 'mode_test';
exports.MODE_PRODUCTION = 'mode_production';

exports.connect = (mode, done) => {
  if (state.db) return done();

  let uri = mode === exports.MODE_TEST ? TEST_URI : PRODUCTION_URI;

  MongoClient.connect(uri, (err, db) => {
    if (err) return done(err);
    state.db = db;
    state.mode = mode;
    done()
  })
};

exports.getDB = () => {
  return state.db;
};

exports.drop = (done) => {
  if (!state.db) return done();
  // This is faster then dropping the database
  state.db.collections((err, collections) => {
    async.each(collections, (collection, cb) => {
      if (collection.collectionName.indexOf('system') === 0) {
        return cb()
      }
      collection.remove(cb)
    }, done)
  })
};

exports.fixtures = (data, done) => {
  const db = state.db;
  if (!db) {
    return done(new Error('Missing database connection.'));
  }

  let names = Object.keys(data.collections);
  async.each(names, (name, cb) => {
    db.createCollection(name, (err, collection) => {
      if (err) return cb(err);
      collection.insert(data.collections[name], cb);
    })
  }, done)
};

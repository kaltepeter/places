const MongoClient = require('mongodb').MongoClient;
const async = require('async');
const yaml_config = require('node-yaml-config');
const config = yaml_config.load('./lib/env.yml');

const state = {
  db: null,
  mode: null,
};

exports.connect = (done) => {
  if (state.db) return done();

  let uri = process.env.MONGODB_URI || config.mongo;
  let mode = process.env.NODE_ENV;

  MongoClient.connect(uri, (err, db) => {
    if (err) return done(err);
    state.db = db;
    state.mode = mode;
    done();
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

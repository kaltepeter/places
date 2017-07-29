const DB = require('../db.js');
const COLLECTION = 'kmls';

exports.all = cb => {
  let db = DB.getDB();
  db.collection(COLLECTION).find().toArray(cb);
};

exports.create = (name, path, cb) => {
  let db = DB.getDB();
  db.collection(COLLECTION).insert({name: name, path: path}, (err, docs) => {
    if (err) return cb(err);
    cb(null, docs.ops[0]);
  })
};

// Remove a comment
exports.remove = (id, cb) => {
  let db = DB.getDB();
  db.collection(COLLECTION).remove({_id:id}, (err, result) => {
    cb(err);
  })
};

exports.find = (id, cb) => {
  let db = DB.getDB();
  db.collection(COLLECTION).find(id).toArray(cb);
};

exports.findBy = (key, value, cb) => {
  let db = DB.getDB();
  let lookup = {};
  lookup[key] = value;
  db.collection(COLLECTION).find(lookup).toArray(cb);
};

const DB = require('../db.js');
const COLLECTION = 'kmls';

exports.all = cb => {
  let db = DB.getDB();
  db.collection(COLLECTION).find().toArray(cb);
};

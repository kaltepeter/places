const express = require('express');
const multer = require('multer');
const app = express();
const Kml = require('./models/kml');

const UPLOAD_PATH = 'uploads';
const upload = multer({ dest: `${UPLOAD_PATH}/` });

app.post('/maps', upload.single('map'), async (request, response) => {
  await Kml.create(request.file.originalname, request.file.path, (err, kml) => {
    response.send(201, {
      id: kml._id
    });
  });
});

module.exports = app;

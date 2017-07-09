const express = require('express');
const multer = require('multer');
const app = express();

const UPLOAD_PATH = 'uploads';
const upload = multer({ dest: `${UPLOAD_PATH}/` });

app.post('/maps', upload.single('map'), async (request, response) => {
  console.log('request: ', request.file);
  await response.sendStatus(201);
});

module.exports = app;

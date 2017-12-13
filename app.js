const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'tmp/' });
const app = express();
const saveGamePro = require('./');

saveGamePro.config.secretKey = 'MyCustomSecretKey';
saveGamePro.config.database.url = 'mongodb://localhost:27017/savegamepro';
saveGamePro.config.uploadFolder = "./uploads/";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(upload.single('file'));
app.post('/savegamepro', saveGamePro);
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const saveGamePro = require('./');

saveGamePro.config.secretKey = 'MyCustomSecretKey';
saveGamePro.config.database.url = 'mongodb://localhost:27017/savegamepro';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.post('/savegamepro', saveGamePro);
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

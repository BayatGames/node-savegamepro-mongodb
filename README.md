# Save Game Pro Cloud - Node.js MongoDB

Save Game Pro Cloud, Node.js MongoDB Database Support.

## Installation

You can install the Save Game Pro Cloud - Node.js MongoDB support via many ways:

- [NPM](#npm) (Recommended)
- [Clone](#clone)
- [Download](#download)

### NPM

Install it via [NPM](https://npmjs.com) (Node Package Manager):

```
npm install node-savegamepro-mongodb --save
```

And then include it in your server script: (Express Recommended)

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const saveGamePro = require('savegamepro-mongodb');
const app = express();

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
```

Now run the script from the command line:

```bash
node app.js
```

You can find the full working example in the app.js file.

### Clone

Clone it using Git:

```
git clone https://github.com/BayatGames/node-savegamepro-mongodb.git
```

Open the directory:

```bash
cd node-savegamepro-mongodb
```

Run the App:

```bash
node app.js
```

### Download

[Download the ZIP](https://github.com/BayatGames/node-savegamepro-mongodb.git) file and extract it and Open the folder then run the below command:

```bash
node app.js
```

## Getting Started

Make sure you have installed the package successfully and the server is running, now go back to Unity and save a simple data to make sure the server is working.

The URL for this example should be `http://localhost:3000/savegamepro` if you are running the server in localhost.

Now fill the required fields in the Unity, for example make sure the Secret Key is same in both server and Unity.

Play the game and make a simple request and make sure the request is successful, also, check the database for the saved data and user.

## Resources

- [Save Game Pro](https://github.com/BayatGames/SaveGamePro)
- [Node.js](https://nodejs.org)
- [MongoDB](https://www.mongodb.com)
- [Express.js](https://expressjs.com/)
- [Support](https://github.com/BayatGames/Support)

## License

MIT @ [Bayat Games](https://github.com/BayatGames)

Made with :heart: by [Bayat Games](https://github.com/BayatGames)

/**
 * Save Game Pro Cloud Node.js MongoDB Database Support.
 *
 * @file Save Game Pro Cloud API for MongoDB database.
 * @license MIT
 * @author Bayat
 */

const MongoClient = require('mongodb').MongoClient;

/**
 * Express Middleware
 * @param  {IncomingMessage}   request  The incomming request
 * @param  {ServerResponse}    response The response
 * @param  {Function}          next     The next callback
 * @return {void}                       Returns nothing
 */
module.exports = function (request, response, next) {
  if (request.method !== 'POST') {
    response.writeHead(400, 'Bad Request');
    response.end('Only POST requests are supported');
    return;
  }
  if (module.exports.config.secretKey !== request.body['secret-key']) {
    response.writeHead(400, 'Bad Request');
    response.end('The given secret key is invalid.');
    return;
  }
  if (!request.body.username) {
    response.writeHead(400, 'Bad Request');
    response.end('The given username is invalid.');
    return;
  }
  let action = module.exports.invalidAction;
  switch (request.body.action) {
    case 'save':
      action = module.exports.save;
      break;
    case 'load':
      action = module.exports.load;
      break;
    case 'delete':
      action = module.exports.delete;
      break;
    case 'clear':
      action = module.exports.clear;
      break;
    default:
      action = module.exports.invalidAction;
      break;
  }
  MongoClient.connect(module.exports.config.database.url, (err, db) => {
    if (err) throw err;
    module.exports.handleUser(request, response, db, (user) => {
      action(request, response, db, user, () => {
        db.close();
      });
    });
  });
};

/**
 * The main configuration for database and Save Game Pro.
 * @type {Object}
 */
module.exports.config = {
  secretKey: '',
  database: {
    url: 'mongodb://localhost:27017/savegamepro'
  }
};

/**
 * Handle the user
 * @param  {IncomingMessage}   request  The incoming request
 * @param  {ServerResponse}    response The response
 * @param  {Db}                db       The database instance
 * @param  {Function}          cb       The callback
 * @return {void}                       Returns nothing
 */
module.exports.handleUser = function (request, response, db, cb) {
  module.exports.getUser(request, response, db, (user) => {
    if (!user) {
      module.exports.createUser(request, response, db, (user) => {
        let result = {
          _id: user.insertedId,
          username: request.body.username,
          password: request.body.password,
          type: 'user'
        };
        if (cb) {
          cb(result);
        }
      });
    } else {
      if (cb) {
        cb(user);
      }
    }
  });
};

/**
 * Retrieves the user from database if exists.
 * @param  {IncomingMessage}   request  The incoming request
 * @param  {ServerResponse}    response The response
 * @param  {Db}                db       The database instance
 * @param  {Function}          cb       The callback
 * @return {void}                       Returns nothing
 */
module.exports.getUser = function (request, response, db, cb) {
  db.collection('users').findOne({
    username: request.body.username,
    password: request.body.password
  }, (err, doc) => {
    if (err) throw err;
    if (cb) {
      cb(doc);
    }
  });
};

/**
 * Creates new user and adds it to the database.
 * @param  {IncomingMessage}   request  The incoming request
 * @param  {ServerResponse}    response The response
 * @param  {Db}                db       The database instance
 * @param  {Function}          cb       The callback
 * @return {void}                       Returns nothing
 */
module.exports.createUser = function (request, response, db, cb) {
  db.collection('users').insertOne({
    username: request.body.username,
    password: request.body.password,
    type: 'user',
    registered: new Date()
  }, (err, doc) => {
    if (err) throw err;
    if (cb) {
      cb(doc);
    }
  });
};

/**
 * Saves the data using the request form data.
 * @param  {IncomingMessage}   request  The incoming request
 * @param  {ServerResponse}    response The response
 * @param  {Db}                db       The database instance
 * @param  {Object}            users    The user
 * @param  {Function}          cb       The callback
 * @return {void}                       Returns nothing
 */
module.exports.save = function (request, response, db, user, cb) {
  let saves = db.collection('saves');
  saves.findOne({
    user_id: user._id,
    data_key: request.body['data-key']
  }, (err, doc) => {
    if (err) throw err;
    if (!doc) {
      saves.insertOne({
        user_id: user._id,
        data_key: request.body['data-key'],
        data_value: request.body['data-value']
      }, (err, doc) => {
        if (err) throw err;
        response.writeHead(200, 'OK');
        response.end('Data Saved Successfully');
        if (cb) {
          cb(request, response, db, user);
        }
      });
    } else {
      saves.updateOne({
        user_id: user._id,
        data_key: request.body['data-key']
      }, { $set: { data_value: request.body['data-value'] } }, (err, doc) => {
        if (err) throw err;
        response.writeHead(200, 'OK');
        response.end('Data Saved Successfully');
        if (cb) {
          cb(request, response, db, user);
        }
      });
    }
  });
};

/**
 * Loads data for the corresponding user.
 * @param  {IncomingMessage}   request  The incoming request
 * @param  {ServerResponse}    response The response
 * @param  {Db}                db       The database instance
 * @param  {Object}            users    The user
 * @param  {Function}          cb       The callback
 * @return {void}                       Returns nothing
 */
module.exports.load = function (request, response, db, user, cb) {
  let saves = db.collection('saves');
  saves.findOne({
    user_id: user._id,
    data_key: request.body['data-key']
  }, (err, doc) => {
    if (err) throw err;
    if (!doc) {
      response.writeHead(404, 'Not Found');
      response.end('The data for the given user and the specified identifier not found.');
    } else {
      response.writeHead(200, 'OK');
      response.end(doc.data_value);
    }
    if (cb) {
      cb(request, response, db, user);
    }
  });
};

/**
 * Deletes the specified identifier in the user saves.
 * @param  {IncomingMessage}   request  The incoming request
 * @param  {ServerResponse}    response The response
 * @param  {Db}                db       The database instance
 * @param  {Object}            users    The user
 * @param  {Function}          cb       The callback
 * @return {void}                       Returns nothing
 */
module.exports.delete = function (request, response, db, user, cb) {
  let saves = db.collection('saves');
  saves.deleteOne({
    user_id: user._id,
    data_key: request.body['data-key']
  }, (err, result) => {
    if (err) throw err;
    response.writeHead(200, 'OK');
    response.end('Data Deleted Successfully');
    if (cb) {
      cb(request, response, db, user);
    }
  });
};

/**
 * Clears the user data.
 * @param  {IncomingMessage}   request  The incoming request
 * @param  {ServerResponse}    response The response
 * @param  {Db}                db       The database instance
 * @param  {Object}            users    The user
 * @param  {Function}          cb       The callback
 * @return {void}                       Returns nothing
 */
module.exports.clear = function (request, response, db, user, cb) {
  let saves = db.collection('saves');
  saves.deleteMany({
    user_id: user._id
  }, (err, result) => {
    if (err) throw err;
    response.writeHead(200, 'OK');
    response.end('User Data Cleared Successfully');
    if (cb) {
      cb(request, response, db, user);
    }
  });
};

/**
 * Responses with invalid action message and terminates the response.
 * @param  {IncomingMessage}   request  The incoming request
 * @param  {ServerResponse}    response The response
 * @param  {Db}                db       The database instance
 * @param  {Object}            users    The user
 * @param  {Function}          cb       The callback
 * @return {void}                       Returns nothing
 */
module.exports.invalidAction = function (request, response, db, user, cb) {
  response.writeHead(400, 'Bad Request');
  response.end('The given action is invalid.');
  if (cb) {
    cb(request, response, db, user);
  }
};

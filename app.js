const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
const Promise = require('bluebird');

const log4js = require('./service/utils/logger');
const stringUtil = require('./service/utils/string');
const cache = require('./service/utils/cache');


let app = express();

let api = require('./service/api')();

// log4js
let accessLogger = log4js.getLogger('access');
let logger = log4js.getLogger(__dirname.replace(APPROOT_PATH, ''));
app.use(log4js.connectLogger(accessLogger));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api);
app.use('/', function(req, res) {
  res.sendfile("./public/index.html");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app;
function init() {
  let registrys = {};

  logger.info("Init function: load registry config to cache");
  if (fs.existsSync(REGISTRY_CONFIG_PATH)) {
    registrys = JSON.parse(fs.readFileSync(REGISTRY_CONFIG_PATH));
    cache.set(REGISTRY_CACHE_KEY, registrys);
  } else {
    cache.set(REGISTRY_CACHE_KEY, {});
    fs.mkdirSync(path.dirname(REGISTRY_CONFIG_PATH));
  }
  return Promise.resolve(registrys);
}

init().then(function() {
  let port = process.env.PORT | 3000;
  
  logger.info("Start function: start app on http://0.0.0.0:" + port);
  app.listen(port);
}).catch(function(err) {
  console.log(err);
});
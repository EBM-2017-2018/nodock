const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config');

const app = express();

const log = require('./log');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/webhooks', require('./webhooks'));
app.use('/api', require('./api'));

app.listen(config.manager.port, () => {
  require('./proxy').register(config.manager.domain, `localhost:${config.manager.port}`, {
    ssl: {
      letsencrypt: {
        email: 'ebm1718travis@gmail.com',
        production: config.proxy.letsEncryptProduction,
      }
    }
  });
  log(`listening on ${config.manager.domain}:${config.proxy.port}`);

  require('./worker/startup')();
});

const R = require('ramda');
const { join } = require('path');
const entities = require('require-all')(__dirname + '/entities');

const urlByEnv = {
  sandbox: 'https://sandbox-b2b.revolut.com/api/1.0/',
  production: 'https://b2b.revolut.com/api/1.0/'
};

const DEFAULT_TIMEOUT = 3000;

module.exports = ({ environment, token, timeout = DEFAULT_TIMEOUT }) => {
  const validEnvironments = Object.keys(urlByEnv);
  if (!environment || !validEnvironments.includes(environment)) throw new Error('You need to specify a valid environment.');
  if (!token) throw new Error('You need to specify an API token.');
  const config = {
    url: urlByEnv[environment],
    token,
    timeout
  };
  const api = R.pipe(
    R.values,
    R.map(R.applyTo(config)),
    R.zipObj(R.keys(entities))
  )(entities);
  return api;
};

const R = require('ramda');
const entities = require('require-all')(`${__dirname}/entities`);
const initRequest = require('./lib/request');

const urlByEnv = {
  test: 'https://testingrevolut.com',
  sandbox: 'https://sandbox-b2b.revolut.com/api/1.0',
  production: 'https://b2b.revolut.com/api/1.0'
};

const DEFAULT_TIMEOUT = 3000;

module.exports = ({
  environment, token, timeout = DEFAULT_TIMEOUT, validation = true
}) => {
  const validEnvironments = Object.keys(urlByEnv);
  if (!environment || !validEnvironments.includes(environment)) throw new Error('You need to specify a valid environment.');
  if (!token) throw new Error('You need to specify an API token.');
  const request = initRequest({ token, timeout });
  const config = {
    url: urlByEnv[environment],
    request,
    validation
  };
  const api = R.pipe(
    R.values,
    R.map(R.applyTo(config)),
    R.zipObj(R.keys(entities))
  )(entities);
  return api;
};

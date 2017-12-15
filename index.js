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
);

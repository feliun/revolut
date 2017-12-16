const debug = require('debug')('revolut:accounts');

module.exports = ({ url, request }) => ({
  // GET https://b2b.revolut.com/api/1.0/accounts
  getAll: () => {
    debug('Getting all accounts');
    return request.get(`${url}/accounts`);
  },
  // GET https://b2b.revolut.com/api/1.0/accounts/<id>
  get: (accountId) => {
    if (!accountId) throw new Error('You need to provide an account ID.');
    debug(`Getting account ${accountId}`);
    return request.get(`${url}/accounts/${accountId}`);
  },
});


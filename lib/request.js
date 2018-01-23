const R = require('ramda');
const debug = require('debug')('revolut:request');
const requestAsPromise = require('request-promise');

module.exports = ({ token, timeout, request }) => {
  const baseOpts = {
    headers: { Authorization: `Bearer ${token}` },
    json: true,
    timeout
  };

  const get = (uri) => {
    debug(`Getting info from url ${uri}}`);
    return requestAsPromise(R.merge({ uri }, baseOpts));
  };

  const post = (uri, body) => {
    debug(`Posting ${JSON.stringify(body, null, 2)} to url ${uri}}`);
    return requestAsPromise(R.merge({ uri, body, method: 'POST' }, baseOpts));
  };

  const remove = (uri) => {
    debug(`Removing resource from url ${uri}}`);
    return requestAsPromise(R.merge({ uri, method: 'DELETE' }, baseOpts));
  };

  return request || { get, post, remove };
};

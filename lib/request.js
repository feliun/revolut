const R = require('ramda');
const requestAsPromise = require('request-promise');

module.exports = ({ token, timeout, request }) => {
  const baseOpts = {
    headers: { Authorization: `Bearer ${token}` },
    json: true,
    timeout
  };

  const get = (uri) => requestAsPromise(R.merge({ uri }, baseOpts));

  const post = (uri, body) => requestAsPromise(R.merge({ uri, body, method: 'POST' }, baseOpts));

  const remove = (uri) => requestAsPromise(R.merge({ uri, method: 'DELETE' }, baseOpts));

  return request || { get, post, remove };
};

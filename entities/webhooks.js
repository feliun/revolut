const debug = require('debug')('revolut:webhooks');

module.exports = ({ url, request }) => ({
  // POST https://sandbox-b2b.revolut.com/api/1.0/webhook
  setup: (webhook) => {
    debug(`Setting up webhook: ${webhook}`);
    return request.post(`${url}/webhook`, webhook);
  }
});


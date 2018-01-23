const assert = require('assert');

module.exports = ({ webhooks }) =>
  webhooks.setup({ url: 'https://example.com/example/path' }).then(console.log);

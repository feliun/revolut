const assert = require('assert');

module.exports = ({ webhooks }) =>
  webhooks.setup('https://localhost:3000/myendpoint')
    .then((result) => {
      console.log(result);
    });

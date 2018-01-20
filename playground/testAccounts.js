const assert = require('assert');

module.exports = ({ accounts }) =>
  Promise.all([
    accounts.getAll(),
    accounts.get('7736d7a9-b283-4b22-a14a-0633054550e7')
  ]).then(([myAccounts, myAccount]) => {
    assert.equal(myAccounts.length, 6);
    assert.equal(myAccount.balance, 0);
    assert.equal(myAccount.currency, 'USD');
    assert.equal(myAccount.state, 'active');
    return Promise.resolve();
  });

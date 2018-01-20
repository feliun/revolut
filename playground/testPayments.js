const assert = require('assert');
const { join } = require('path');

const {
  transfer,
  payment: samplePayment
} = require('require-all')(join(__dirname, '..', 'test', 'fixtures', 'payments'));

const {
  uk_account
} = require('require-all')(join(__dirname, '..', 'test', 'fixtures', 'counterparties'));

const getGBPAccounts = (accounts) => {
  const byGBP = ({ currency }) => currency === 'GBP';
  const byBalance = (a, b) => a.balance < b.balance;

  return accounts.getAll()
    .then((myAccounts) => myAccounts.filter(byGBP).sort(byBalance));
};

const testCounterpartyPayment = (accounts, counterparties, payments) => {
  const processPayment = (source, target, reference = '') => {
    const unique = `${new Date().getTime()}`;
    const payment = {
      request_id: unique,
      account_id: source.id,
      receiver: {
        counterparty_id: target.id
      },
      amount: 10,
      currency: 'GBP',
      reference
    };
    return payments.pay(payment);
  };

  return counterparties.add(uk_account)
    .then((newCounterparty) => getGBPAccounts(accounts)
      .then((gbpAccounts) => {
        if (gbpAccounts.length < 1) throw new Error('At least 1 GBP revolut account is needed');
        const [myAccount] = gbpAccounts;
        const reference = 'Testing payment to counterparty';
        return processPayment(myAccount, newCounterparty, reference)
          .then((result) => {
            console.log(result);
            return counterparties.remove(newCounterparty.counterpartyId);
          });
      }));
};

const testRevolutTransfers = (accounts, payments) => {
  const processTransfer = (source, target, reference = '') => {
    const unique = `${new Date().getTime()}`;
    const revolutTransfer = {
      request_id: unique,
      source_account_id: source.id,
      target_account_id: target.id,
      amount: 10,
      currency: 'GBP',
      reference
    };
    return payments.transfer(revolutTransfer);
  };

  return getGBPAccounts(accounts)
    .then((gbpAccounts) => {
      if (gbpAccounts.length < 2) throw new Error('At least 2 GBP revolut accounts are needed');
      const [source, target] = gbpAccounts;
      const firstRef = 'Reference 1 for revolut transfers';
      return processTransfer(source, target, firstRef)
        .then(({ state }) => {
          assert.equal(state, 'completed');
          console.log('Putting money back...');
          const secondRef = 'Reference 2 for revolut transfers';
          return processTransfer(target, source, secondRef)
            .then(({ id, state: secondState }) => {
              assert.equal(secondState, 'completed');
              return payments.getStatusById(id)
                .then((response) => {
                  assert.equal(response.type, 'transfer');
                  assert.equal(response.state, 'completed');
                  assert.equal(response.reference, secondRef);
                });
            });
        });
    });
};


module.exports = ({ accounts, counterparties, payments }) =>
  testRevolutTransfers(accounts, payments);
// .then(() => testCounterpartyPayment(accounts, counterparties, payments));

const assert = require('assert');
const R = require('ramda');
const { join } = require('path');
const program = require('commander');
const inquirer = require('inquirer');
const initRevolut = require('..');
const {
  revolut_account,
  uk_account,
  us_account,
  eu_account,
  other_account
} = require('require-all')(join(__dirname, '..', 'test', 'fixtures', 'counterparties'));

const {
  transfer,
  payment: samplePayment
} = require('require-all')(join(__dirname, '..', 'test', 'fixtures', 'payments'));

const prompt = inquirer.createPromptModule();

program
  .version('0.0.1')
  .option('-e, --environment <environment>', 'environment')
  .option('-t, --token <token>', 'token')
  .parse(process.argv);

const questions = [];

if (!program.environment) {
  questions.push({
    name: 'environment', type: 'list', message: 'Environment', choices: ['sandbox', 'live'], default: 'sandbox'
  });
}
if (!program.token) {
  questions.push({
    name: 'token', type: 'password', message: 'Token', default: 'token'
  });
}

const sequential = R.reduce((chain, promise) => chain.then(promise), Promise.resolve());

const format = (json) => JSON.stringify(json, null, 2);

const tryAccounts = ({ accounts }) =>
  Promise.all([
    accounts.getAll(),
    accounts.get('7736d7a9-b283-4b22-a14a-0633054550e7')
  ]).then(([myAccounts, myAccount]) => {
    console.log(`myAccounts: ${format(myAccounts)}`);
    console.log(`myAccount: ${format(myAccount)}`);
    return Promise.resolve();
  });

const getGBPAccounts = (accounts) => {
  const byGBP = ({ currency }) => currency === 'GBP';
  const byBalance = (a, b) => a.balance < b.balance;

  return accounts.getAll()
    .then((myAccounts) => myAccounts.filter(byGBP).sort(byBalance));
};

const tryCounterpartyPayment = (accounts, counterparties, payments) => {
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

const tryRevolutTransfers = (accounts, payments) => {
  const byGBP = ({ currency }) => currency === 'GBP';
  const byBalance = (a, b) => a.balance < b.balance;

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

  return accounts.getAll()
    .then((myAccounts) => {
      const gbpAccounts = myAccounts.filter(byGBP).sort(byBalance);
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

const tryPayments = ({ accounts, counterparties, payments }) =>
  tryRevolutTransfers(accounts, payments);
// .then(() => tryCounterpartyPayment(accounts, counterparties, payments));

const tryCounterparties = ({ counterparties }) =>
  sequential([
    // counterparties.add(revolut_account),
    counterparties.add(uk_account),
    counterparties.add(us_account),
    // counterparties.add(eu_account),
    // counterparties.add(other_account),
    counterparties.getAll().then((cps) => {
      const deletions = cps.map(({ id }) => counterparties.remove(id));
      return Promise.all(deletions);
    }),
  ]);

prompt(questions)
  .then(({ environment = program.environment, token = program.token }) => {
    const revolut = initRevolut({ environment, token, timeout: 5000 });
    return sequential([
      tryAccounts(revolut),
      tryCounterparties(revolut),
      tryPayments(revolut)
    ]);
  })
  .catch(console.error);


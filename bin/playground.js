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
  payment: samplePayment,
  payment_status
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

const tryAccounts = (accounts) =>
  Promise.all([
    accounts.getAll(),
    accounts.get('7736d7a9-b283-4b22-a14a-0633054550e7')
  ]).then(([myAccounts, myAccount]) => {
    console.log('myAccounts', myAccounts);
    console.log('myAccount', myAccount);
  });

const tryPayments = (payments) =>
  sequential([
    Promise.resolve()
  ]);

const tryCounterparties = (counterparties) =>
  sequential([
    counterparties.getAll().then(console.log),
    // counterparties.add(revolut_account),
    // counterparties.add(uk_account),
    // counterparties.add(us_account),
    // counterparties.add(eu_account),
    // counterparties.add(other_account)
  ]);

prompt(questions)
  .then(({ environment = program.environment, token = program.token }) => {
    const revolut = initRevolut({ environment, token, timeout: 1000 });
    return sequential([
      tryAccounts(revolut.accounts),
      tryCounterparties(revolut.counterparties),
      tryPayments(revolut.payments)
    ]);
  })
  .catch(console.error);

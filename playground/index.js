const program = require('commander');
const inquirer = require('inquirer');
const R = require('ramda');
const { join } = require('path');
const initRevolut = require('..');

const {
  testAccounts,
  testCounterparties,
  testPayments,
  testWebhooks
} = require('require-all')(join(__dirname));

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

prompt(questions)
  .then(({ environment = program.environment, token = program.token }) => {
    const revolut = initRevolut({ environment, token, timeout: 5000 });
    return sequential([
      testAccounts(revolut),
      testCounterparties(revolut),
      testPayments(revolut),
      // testWebhooks(revolut)
    ]);
  })
  .catch(console.error);

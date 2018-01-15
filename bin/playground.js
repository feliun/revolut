const program = require('commander');
const inquirer = require('inquirer');
const initRevolut = require('..');

const prompt = inquirer.createPromptModule();
let revolut;

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

prompt(questions)
  .then(({ environment = program.environment, token = program.token }) => {
    revolut = initRevolut({ environment, token });
  })
  .catch(console.error);

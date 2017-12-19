const expect = require('expect.js');
const initRevolut = require('..');

const entities = ['accounts', 'counterparties', 'payments', 'webhooks'];

describe('Revolut API initialisation', () => {
  it('fails to initialise when environment is not provided', () =>
    Promise.resolve()
      .then(() => initRevolut({}))
      .then(() => { throw new Error('I shouldn not be here!'); })
      .catch((error) => {
        expect(error.message).to.equal('You need to specify a valid environment.');
      }));

  it('fails to initialise when an invalid environment is provided', () =>
    Promise.resolve()
      .then(() => initRevolut({ environment: 'invalid' }))
      .then(() => { throw new Error('I shouldn not be here!'); })
      .catch((error) => {
        expect(error.message).to.equal('You need to specify a valid environment.');
      }));

  it('fails to initialise when an API token is not provided', () =>
    Promise.resolve()
      .then(() => initRevolut({ environment: 'sandbox' }))
      .then(() => { throw new Error('I shouldn not be here!'); })
      .catch((error) => {
        expect(error.message).to.equal('You need to specify an API token.');
      }));

  it('initialises correctly when a valid environment and an API token are provided', () =>
    Promise.resolve()
      .then(() => initRevolut({ environment: 'sandbox', token: 'BITCOIN' }))
      .then((wrapper) => expect(Object.keys(wrapper)).to.eql(entities)));
});


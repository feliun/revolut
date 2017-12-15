const expect = require('expect.js');
const initRevolut = require('..');

const entities = ['accounts', 'counterparties'];

describe('Revolut API initialisation', () => {
  it('fails to initialise when environment is not provided', () =>
    Promise.resolve()
      .then(() => initRevolut({}))
      .catch((error) => {
        expect(error.message).to.equal('You need to specify a valid environment.');
      }));

  it('fails to initialise when an invalid environment is provided', () =>
    Promise.resolve()
      .then(() => initRevolut({ environment: 'invalid' }))
      .catch((error) => {
        expect(error.message).to.equal('You need to specify a valid environment.');
      }));

  it('fails to initialise when an API token is not provided', () =>
    Promise.resolve()
      .then(() => initRevolut({ environment: 'sandbox' }))
      .catch((error) => {
        expect(error.message).to.equal('You need to specify an API token.');
      }));

  it('initialises correctly when a valid environment and an API token are provided', () =>
    Promise.resolve()
      .then(() => initRevolut({ environment: 'sandbox', token: 'BITCOIN' }))
      .then((wrapper) => expect(Object.keys(wrapper)).to.eql(entities)));
});


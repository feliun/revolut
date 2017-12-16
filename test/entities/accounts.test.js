const { OK, NOT_FOUND } = require('http-status-codes');
const expect = require('expect.js');
const nock = require('nock');
const initRevolut = require('../..');

const accounts = require('../fixtures/accounts.json');

// Based on https://revolutdev.github.io/business-api/?shell--sandbox#accounts

describe('Accounts API', () => {
  const REVOLUT_URL = 'https://testingrevolut.com';

  let revolut;
  const environment = 'test';
  const token = 'BITCOIN';

  before(() => {
    revolut = initRevolut({ environment, token });
  });

  it('GETs all accounts', () => {
    nock(REVOLUT_URL, { reqheaders: { Authorization: `Bearer ${token}` } })
      .get('/accounts')
      .reply(OK, accounts);

    return revolut.accounts.getAll()
      .then((res) => expect(res).to.eql(accounts));
  });

  it('fails to get a single account if no account ID is provided', () =>
    Promise.resolve()
      .then(() => revolut.accounts.get(null))
      .then(() => { throw new Error('I shouldn not be here!'); })
      .catch((error) => expect(error.message).to.equal('You need to provide an account ID.')));

  it('GETs a single account', () => {
    const myAccount = accounts[0];
    nock(REVOLUT_URL, { reqheaders: { Authorization: `Bearer ${token}` } })
      .get(`/accounts/${myAccount.id}`)
      .reply(OK, myAccount);

    return revolut.accounts.get(myAccount.id)
      .then((res) => expect(res).to.eql(myAccount));
  });

  it('surfaces errors from Revolut', () => {
    nock(REVOLUT_URL, { reqheaders: { Authorization: `Bearer ${token}` } })
      .get('/accounts/1234')
      .reply(NOT_FOUND, undefined);

    return revolut.accounts.get(1234)
      .then(() => { throw new Error('I shouldn not be here!'); })
      .catch((error) => {
        expect(error.statusCode).to.equal(NOT_FOUND);
        expect(error.message).to.equal('404 - undefined');
      });
  });
});


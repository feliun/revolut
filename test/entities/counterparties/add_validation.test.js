const R = require('ramda');
const { join } = require('path');
const { OK } = require('http-status-codes');
const expect = require('expect.js');
const nock = require('nock');
const initRevolut = require('../../..');
const {
  counterparty_response,
  uk_account,
  us_account,
  revolut_account,
  eu_account,
  other_account
} = require('require-all')(join(__dirname, '..', '..', 'fixtures', 'counterparties'));

// Based on https://revolutdev.github.io/business-api/?shell--sandbox#counterparties

describe('Validation for new counterparties', () => {
  const REVOLUT_URL = 'https://testingrevolut.com';

  let revolut;
  const environment = 'test';
  const token = 'BITCOIN';

  before(() => {
    revolut = initRevolut({ environment, token });
  });

  const add = (counterparty) => {
    nock(REVOLUT_URL, { reqheaders: { Authorization: `Bearer ${token}` } })
      .post('/counterparty', counterparty)
      .reply(OK, counterparty_response);

    return revolut.counterparties.add(counterparty);
  };

  describe('Validation for new Revolut users', () => {
    it('POSTs a new valid revolut counterparty', () => add(revolut_account));

    it('fails to add an invalid revolut counterparty', () => {
      const faultyAccount = R.omit(['name'], revolut_account);
      return Promise.resolve()
        .then(() => add(faultyAccount))
        .then(() => { throw new Error('I should not be here!'); })
        .catch((error) => expect(error.message).to.equal('ValidationError: child "name" fails because ["name" is required]'));
    });
  });

  describe('Validation for new UK Bank Account users', () => {
    it('POSTs a new valid UK bank account counterparty', () => add(uk_account));

    it('fails to add an invalid UK Bank Account', () => {
      const faultyAccount = R.omit(['account_no'], uk_account);
      return Promise.resolve()
        .then(() => add(faultyAccount))
        .then(() => { throw new Error('I should not be here!'); })
        .catch((error) => expect(error.message).to.equal('ValidationError: child "account_no" fails because ["account_no" is required]'));
    });
  });

  describe('Validation for new EU Bank Account users', () => {
    it('POSTs a new valid EU bank account counterparty', () => add(eu_account));

    it('fails to add an invalid EU Bank Account', () => {
      const faultyAccount = R.omit(['bic'], eu_account);
      return Promise.resolve()
        .then(() => add(faultyAccount))
        .then(() => { throw new Error('I should not be here!'); })
        .catch((error) => expect(error.message).to.equal('ValidationError: child "bic" fails because ["bic" is required]'));
    });
  });

  describe('Validation for new US Bank Account users', () => {
    it('POSTs a new valid US bank account counterparty', () => add(us_account));

    it('fails to add an invalid US Bank Account', () => {
      const faultyAccount = R.omit(['routing_number'], us_account);
      return Promise.resolve()
        .then(() => add(faultyAccount))
        .then(() => { throw new Error('I should not be here!'); })
        .catch((error) => expect(error.message).to.equal('ValidationError: child "routing_number" fails because ["routing_number" is required]'));
    });
  });

  describe('Validation for (other) Bank Account users', () => {
    it('POSTs a new valid (other) bank account counterparty', () => add(other_account));

    it('fails to add an invalid (other) Bank Account', () => {
      const faultyAccount = R.omit(['bic'], other_account);
      return Promise.resolve()
        .then(() => add(faultyAccount))
        .then(() => { throw new Error('I should not be here!'); })
        .catch((error) => expect(error.message).to.equal('ValidationError: child "bic" fails because ["bic" is required]'));
    });
  });
});


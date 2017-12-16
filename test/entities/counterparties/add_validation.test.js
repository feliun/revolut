const R = require('ramda');
const { OK } = require('http-status-codes');
const expect = require('expect.js');
const nock = require('nock');
const initRevolut = require('../../..');

const counterparty_response = require('../../fixtures/counterparties/counterparty_response.json');
const uk_account = require('../../fixtures/counterparties/uk_account.json');
const us_account = require('../../fixtures/counterparties/us_account.json');
const eu_account = require('../../fixtures/counterparties/eu_account.json');

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
    it('POSTs a new valid revolut counterparty', () => {
      const revolutAccount = {
        name: 'Luke Skywalker',
        profile_type: 'personal'
      };
      return add(revolutAccount);
    });

    it('fails to add an invalid revolut counterparty', () => {
      const revolutAccount = {
        name: null,
        profile_type: 'personal'
      };
      return Promise.resolve()
        .then(() => add(revolutAccount))
        .then(() => { throw new Error('I should not be here!'); })
        .catch((error) => expect(error.message).to.equal('ValidationError: child "name" fails because ["name" must be a string]'));
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

  describe('Validation for new EUR Bank Account users', () => {
    it('POSTs a new valid EUR bank account counterparty', () => add(eu_account));

    it('fails to add an invalid EUR Bank Account', () => {
      const faultyAccount = R.omit(['bic'], eu_account);
      return Promise.resolve()
        .then(() => add(faultyAccount))
        .then(() => { throw new Error('I should not be here!'); })
        .catch((error) => expect(error.message).to.equal('ValidationError: child "bic" fails because ["bic" is required]'));
    });
  });
});


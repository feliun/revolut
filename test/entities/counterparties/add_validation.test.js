const { OK } = require('http-status-codes');
const expect = require('expect.js');
const nock = require('nock');
const initRevolut = require('../../..');

const counterparty_response = require('../../fixtures/counterparties/counterparty_response.json');

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
        .catch((error) => expect(error.message).to.equal('ValidationError: child "name" fails because ["name" must be a string]'));
    });
  });
});


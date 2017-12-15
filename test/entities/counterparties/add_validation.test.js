const { OK, NOT_FOUND, NO_CONTENT } = require('http-status-codes');
const expect = require('expect.js');
const nock = require('nock');
const initRevolut = require('../../..');

const revolut_account = require('../../fixtures/counterparties/revolut_account.json');
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

  it('POSTs a new revolut counterparty', () => {
    nock(REVOLUT_URL, { reqheaders: { Authorization: `Bearer ${token}` } })
      .post('/counterparty', revolut_account)
      .reply(OK, counterparty_response);

    return revolut.counterparties.add(revolut_account)
      .then((res) => expect(res).to.eql(counterparty_response));
  });
});


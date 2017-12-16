const { OK, NOT_FOUND, NO_CONTENT } = require('http-status-codes');
const expect = require('expect.js');
const nock = require('nock');
const initRevolut = require('../../..');

const counterparties = require('../../fixtures/counterparties/counterparties.json');
const counterparty_response = require('../../fixtures/counterparties/counterparty_response.json');
const counterparty_input = require('../../fixtures/counterparties/revolut_account.json');

// Based on https://revolutdev.github.io/business-api/?shell--sandbox#counterparties

describe('Counterparties API', () => {
  const REVOLUT_URL = 'https://testingrevolut.com';

  let revolut;
  const environment = 'test';
  const token = 'BITCOIN';

  before(() => {
    revolut = initRevolut({ environment, token });
  });

  it('POSTs a new counterparty', () => {
    nock(REVOLUT_URL, { reqheaders: { Authorization: `Bearer ${token}` } })
      .post('/counterparty', counterparty_input)
      .reply(OK, counterparty_response);

    return revolut.counterparties.add(counterparty_input)
      .then((res) => expect(res).to.eql(counterparty_response));
  });

  it('fails to DELETE a single counterparty if no counterparty ID is provided', () =>
    Promise.resolve()
      .then(() => revolut.counterparties.remove(null))
      .then(() => { throw new Error('I shouldn not be here!'); })
      .catch((error) => expect(error.message).to.equal('You need to provide a counterparty ID.')));

  it('DELETEs a single counterparty', () => {
    const myCounterparty = counterparties[0];
    nock(REVOLUT_URL, { reqheaders: { Authorization: `Bearer ${token}` } })
      .delete(`/counterparty/${myCounterparty.id}`)
      .reply(NO_CONTENT);

    return revolut.counterparties.remove(myCounterparty.id)
      .then((res) => expect(res).to.eql(undefined));
  });

  it('GETs all counterparties', () => {
    nock(REVOLUT_URL, { reqheaders: { Authorization: `Bearer ${token}` } })
      .get('/counterparties')
      .reply(OK, counterparties);

    return revolut.counterparties.getAll()
      .then((res) => expect(res).to.eql(counterparties));
  });

  it('fails to get a single counterparty if no counterparty ID is provided', () =>
    Promise.resolve()
      .then(() => revolut.counterparties.get(null))
      .then(() => { throw new Error('I shouldn not be here!'); })
      .catch((error) => expect(error.message).to.equal('You need to provide a counterparty ID.')));

  it('GETs a single counterparty', () => {
    const myCounterparty = counterparties[0];
    nock(REVOLUT_URL, { reqheaders: { Authorization: `Bearer ${token}` } })
      .get(`/counterparty/${myCounterparty.id}`)
      .reply(OK, myCounterparty);

    return revolut.counterparties.get(myCounterparty.id)
      .then((res) => expect(res).to.eql(myCounterparty));
  });

  it('surfaces errors from Revolut', () => {
    nock(REVOLUT_URL, { reqheaders: { Authorization: `Bearer ${token}` } })
      .get('/counterparty/1234')
      .reply(NOT_FOUND, undefined);

    return revolut.counterparties.get(1234)
      .then(() => { throw new Error('I shouldn not be here!'); })
      .catch((error) => {
        expect(error.statusCode).to.equal(NOT_FOUND);
        expect(error.message).to.equal('404 - undefined');
      });
  });
});


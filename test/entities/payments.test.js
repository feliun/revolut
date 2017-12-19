const R = require('ramda');
const { OK, NO_CONTENT } = require('http-status-codes');
const expect = require('expect.js');
const nock = require('nock');
const { join } = require('path');
const initRevolut = require('../..');

const {
  transfer,
  payment: samplePayment,
  payment_status
} = require('require-all')(join(__dirname, '..', 'fixtures', 'payments'));

// Based on https://revolutdev.github.io/business-api/?shell--sandbox#payments

describe('Payments API', () => {
  const REVOLUT_URL = 'https://testingrevolut.com';

  let revolut;
  const environment = 'test';
  const token = 'BITCOIN';

  before(() => {
    revolut = initRevolut({ environment, token });
  });

  describe('Transfers', () => {
    const processTransfer = (payment) => {
      nock(REVOLUT_URL, { reqheaders: { Authorization: `Bearer ${token}` } })
        .post('/transfer', payment)
        .reply(OK, {});
      return revolut.payments.transfer(payment);
    };

    it('POSTs a new valid revolut transfer', () => processTransfer(transfer));

    it('fails to add an invalid revolut transfer', () => {
      const faultyTransfer = R.omit(['currency'], transfer);
      return Promise.resolve()
        .then(() => processTransfer(faultyTransfer))
        .then(() => { throw new Error('I should not be here!'); })
        .catch((error) => expect(error.message).to.equal('ValidationError: child "currency" fails because ["currency" is required]'));
    });
  });

  describe('Payments', () => {
    const processPayment = (payment) => {
      nock(REVOLUT_URL, { reqheaders: { Authorization: `Bearer ${token}` } })
        .post('/pay', payment)
        .reply(OK, {});
      return revolut.payments.pay(payment);
    };

    it('POSTs a new valid revolut payment', () => processPayment(samplePayment));

    it('fails to add an invalid revolut payment', () => {
      const faultyPayment = R.omit(['currency'], samplePayment);
      return Promise.resolve()
        .then(() => processPayment(faultyPayment))
        .then(() => { throw new Error('I should not be here!'); })
        .catch((error) => expect(error.message).to.equal('ValidationError: child "currency" fails because ["currency" is required]'));
    });

    it('fails to get payment status if no transaction ID is provided', () =>
      Promise.resolve()
        .then(() => revolut.payments.getStatusById(null))
        .then(() => { throw new Error('I should not be here!'); })
        .catch((error) => expect(error.message).to.equal('You need to provide a transaction ID.')));

    it('GETs payment status by ID', () => {
      const txId = 123456;
      nock(REVOLUT_URL, { reqheaders: { Authorization: `Bearer ${token}` } })
        .get(`/transaction/${txId}`)
        .reply(OK, payment_status);
      return revolut.payments.getStatusById(txId)
        .then((response) => expect(response).to.eql(payment_status));
    });

    it('fails to get payment status if no request ID is provided', () =>
      Promise.resolve()
        .then(() => revolut.payments.getStatusByRequestId(null))
        .then(() => { throw new Error('I should not be here!'); })
        .catch((error) => expect(error.message).to.equal('You need to provide a request ID.')));

    it('GETs payment status by ID', () => {
      const reqId = 123456;
      nock(REVOLUT_URL, { reqheaders: { Authorization: `Bearer ${token}` } })
        .get(`/transaction/${reqId}?id_type=request_id`)
        .reply(OK, payment_status);
      return revolut.payments.getStatusByRequestId(reqId)
        .then((response) => expect(response).to.eql(payment_status));
    });

    it('fails to DELETE a payment if no transaction ID is provided', () =>
      Promise.resolve()
        .then(() => revolut.payments.cancel(null))
        .then(() => { throw new Error('I shouldn not be here!'); })
        .catch((error) => expect(error.message).to.equal('You need to provide a transaction ID.')));

    it('DELETEs a payment', () => {
      const txId = 123456789;
      nock(REVOLUT_URL, { reqheaders: { Authorization: `Bearer ${token}` } })
        .delete(`/transaction/${txId}`)
        .reply(NO_CONTENT);

      return revolut.payments.cancel(txId)
        .then((res) => expect(res).to.eql(undefined));
    });

    it('GETs payments based on a certain criteria', () => {
      const result = [{}, {}, {}];
      nock(REVOLUT_URL, { reqheaders: { Authorization: `Bearer ${token}` } })
        .get('/transactions?count=20&from=2017-10-12')
        .reply(OK, result);

      return revolut.payments.getByCriteria({ count: 20, from: '2017-10-12' })
        .then((res) => expect(res).to.eql(result));
    });

    it('GETs payments when no criteria is specified', () => {
      const result = [{}, {}, {}];
      nock(REVOLUT_URL, { reqheaders: { Authorization: `Bearer ${token}` } })
        .get('/transactions?')
        .reply(OK, result);

      return revolut.payments.getByCriteria()
        .then((res) => expect(res).to.eql(result));
    });
  });
});


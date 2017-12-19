const { OK } = require('http-status-codes');
const nock = require('nock');
const { join } = require('path');
const initRevolut = require('../..');

const { webhook } = require('require-all')(join(__dirname, '..', 'fixtures', 'webhooks'));

// Based on https://revolutdev.github.io/business-api/?shell--sandbox#web-hooks

describe('Webhook API', () => {
  const REVOLUT_URL = 'https://testingrevolut.com';

  let revolut;
  const environment = 'test';
  const token = 'BITCOIN';

  before(() => {
    revolut = initRevolut({ environment, token });
  });

  describe('Webhooks', () => {
    const setup = (data) => {
      nock(REVOLUT_URL, { reqheaders: { Authorization: `Bearer ${token}` } })
        .post('/webhook', data)
        .reply(OK, {});
      return revolut.webhooks.setup(data);
    };

    it('POSTs a webhook', () => setup(webhook));
  });
});


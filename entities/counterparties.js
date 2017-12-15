const { join } = require('path');
const schemas = require('require-all')(join(__dirname, '..', 'schemas'));

const validate = (counterparty) => {

};

module.exports = ({ url, request }) => {
  // POST https://b2b.revolut.com/api/1.0/counterparty
  const add = (counterparty) => {
    validate(counterparty);
    return request.post(`${url}/counterparty`, counterparty);
  };

  // DELETE https://b2b.revolut.com/api/1.0/counterparty/<id>
  const remove = (counterpartyId) => {
    if (!counterpartyId) throw new Error('You need to provide a counterparty ID.');
    return request.remove(`${url}/counterparty/${counterpartyId}`);
  };

  // GET https://b2b.revolut.com/api/1.0/counterparties
  const getAll = () => request.get(`${url}/counterparties`);

  // GET https://b2b.revolut.com/api/1.0/counterparty/<id>
  const get = (counterpartyId) => {
    if (!counterpartyId) throw new Error('You need to provide a counterparty ID.');
    return request.get(`${url}/counterparty/${counterpartyId}`);
  };

  // TODO add validation and tests

  return {
    add, remove, getAll, get
  };
};

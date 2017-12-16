const debug = require('debug')('revolut:counterparties');
const validate = require('../lib/validators/counterparties');

module.exports = ({ url, request }) => {
  // POST https://b2b.revolut.com/api/1.0/counterparty
  const add = (counterparty) => {
    debug('Adding a new counterparty');
    return request.post(`${url}/counterparty`, validate(counterparty));
  };

  // DELETE https://b2b.revolut.com/api/1.0/counterparty/<id>
  const remove = (counterpartyId) => {
    if (!counterpartyId) throw new Error('You need to provide a counterparty ID.');
    debug(`Deleting counterparty ${counterpartyId}`);
    return request.remove(`${url}/counterparty/${counterpartyId}`);
  };

  // GET https://b2b.revolut.com/api/1.0/counterparties
  const getAll = () => {
    debug('Getting all counterparties');
    return request.get(`${url}/counterparties`);
  };

  // GET https://b2b.revolut.com/api/1.0/counterparty/<id>
  const get = (counterpartyId) => {
    if (!counterpartyId) throw new Error('You need to provide a counterparty ID.');
    debug(`Getting counterparty ${counterpartyId}`);
    return request.get(`${url}/counterparty/${counterpartyId}`);
  };

  return {
    add, remove, getAll, get
  };
};

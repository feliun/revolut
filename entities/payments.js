const R = require('ramda');
const debug = require('debug')('revolut:payments');

module.exports = ({ url, request, validation }) => {
  const validate = validation ? require('../lib/validators/payments') : R.identity;

  // POST https://b2b.revolut.com/api/1.0/transfer
  const transfer = (payment) => {
    debug('Processing transfer within Revolut accounts');
    return request.post(`${url}/transfer`, validate(payment));
  };

  // POST https://b2b.revolut.com/api/1.0/pay
  const pay = (payment) => {
    debug('Processing payment');
    return request.post(`${url}/pay`, validate(payment));
  };

  // GET https://b2b.revolut.com/api/1.0/transaction/<id>
  const getStatusById = (txId) => {
    if (!txId) throw new Error('You need to provide a transaction ID.');
    debug(`Getting payment status for transaction ${txId}`);
    return request.get(`${url}/transaction/${txId}`);
  };

  // GET https://b2b.revolut.com/api/1.0/transaction/<request_id>
  const getStatusByRequestId = (requestId) => {
    if (!requestId) throw new Error('You need to provide a request ID.');
    debug(`Getting payment status for request ${requestId}`);
    return request.get(`${url}/transaction/${requestId}?id_type=request_id`);
  };

  // DELETE https://b2b.revolut.com/api/1.0/transaction/<id>
  const cancel = (txId) => {
    if (!txId) throw new Error('You need to provide a transaction ID.');
    debug(`Cancelling payment with ID ${txId}`);
    return request.remove(`${url}/transaction/${txId}`);
  };

  // GET https://b2b.revolut.com/api/1.0/transactions
  const getByCriteria = (criteria = {}) => {
    const options = ['from', 'to', 'counterparty', 'count', 'type'];
    const generateParams = R.pipe(
      R.keys,
      R.intersection(options),
      R.map((option) => `${option}=${criteria[option]}`),
      R.join('&')
    );
    const queryParams = generateParams(criteria);
    debug(`Getting payments for criteria ${queryParams}`);
    return request.get(`${url}/transactions?${queryParams}`);
  };

  return {
    transfer,
    pay,
    getStatusById,
    getStatusByRequestId,
    getByCriteria,
    cancel,
  };
};

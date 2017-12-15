module.exports = ({ url, request }) => ({
  // GET https://b2b.revolut.com/api/1.0/accounts
  getAll: () => request.get(`${url}/accounts`),
  // GET https://b2b.revolut.com/api/1.0/accounts/<id>
  get: (accountId) => {
    if (!accountId) throw new Error('You need to provide an account ID.');
    return request.get(`${url}/accounts/${accountId}`);
  },
});


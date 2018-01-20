const R = require('ramda');
const { join } = require('path');
const {
  revolut_account,
  uk_account,
  us_account,
  eu_account,
  other_account
} = require('require-all')(join(__dirname, '..', 'test', 'fixtures', 'counterparties'));

const sequential = R.reduce((chain, promise) => chain.then(promise), Promise.resolve());

module.exports = ({ counterparties }) =>
  sequential([
    // counterparties.add(revolut_account),
    counterparties.add(uk_account),
    counterparties.add(us_account),
    // counterparties.add(eu_account),
    // counterparties.add(other_account),
    counterparties.getAll().then((cps) => {
      const deletions = cps.map(({ id }) => counterparties.remove(id));
      return Promise.all(deletions);
    }),
  ]);

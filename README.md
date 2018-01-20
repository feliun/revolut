# revolut
A Revolut API client for Node JS

This is a wrapper for [the Revolut API](https://revolutdev.github.io/business-api/#introduction)

**WARNING**: this API has not yet been released by Revolut. Testing for this wrapper is WIP. Some use examples of this wrapper could be found (here)[https://github.com/feliun/revolut/tree/master/playground];

This NodeJS APIs is helpful because:

1. it hides revolut urls from you
2. Configuration is injected on startup and used everywhere in a transparent way
3. It applies validation on input messages (unless opted out, useful for debugging)
4. It exposes an API based on promises
5. It offers underlying information by using `DEBUG=revolut*`
6. Handles errors appropriately

# how to use it
To use the revolut wrapper you just need to initialise it like this:

```
const initRevolut = require('revolut');
const config = {
    environment: 'sandbox',
    token: '7634253428AKHDJAGWD7868',
    validation: false,
    timeout: 2000
};
const revolut = initRevolut(config);
```

As you can guess, you can pass in configuration `environment` (sandbox|production), `token` and `timeout` for requests (this one is optional). Also, `validation` will be _true_ by default.

## accounts
API for [accounts](https://revolutdev.github.io/business-api/?shell--sandbox#accounts)

### getAll
```
return revolut.accounts.getAll();
```

### get
```
return revolut.accounts.get("insert an account ID here");
```

## counterparties
API for [counterparties](https://revolutdev.github.io/business-api/?shell--sandbox#counterparties)

### add
```
const revolutAccount = ...;
// https://revolutdev.github.io/business-api/#add-counterparty
return revolut.counterparties.add(revolut_account);
```

### remove
```
return revolut.counterparties.remove("insert a counterparty ID here");
```

### getAll
```
return revolut.counterparties.getAll();
```

### get
```
return revolut.counterparties.get("insert a counterparty ID here");
```

## payments
API for [payments](https://revolutdev.github.io/business-api/?shell--sandbox#payments)
### transfer
```
const payment = ...;
// https://revolutdev.github.io/business-api/?shell--sandbox#transfer-between-own-accounts-in-the-same-currency
return revolut.payments.transfer(payment);
```

### pay
```
const payment = ...;
// https://revolutdev.github.io/business-api/?shell--sandbox#create-payment
return revolut.payments.pay(payment);
```

### getStatusById
```
return revolut.payments.getStatusById("insert a tx ID here");
```

### getStatusByRequestId
```
return revolut.payments.getStatusByRequestId("insert a tx ID here");
```

### getByCriteria
```
// https://revolutdev.github.io/business-api/?shell--sandbox#get-transactions
return revolut.payments.getByCriteria({ count: 20, from: '2017-10-12' });
```

### cancel
```
return revolut.payments.cancel("insert a tx ID here");
```

## webhooks
### setup
```
return revolut.webhooks.setup({ "url": "https://example.com/example/path" });
```
# Tests for counterparty messages on sandbox

I created a script to test counterparties functionalities against sandbox. The ran operations could be found [here](https://github.com/feliun/revolut/blob/master/playground/testCounterparties.js);

Please find below some issues I found while testing.

## [Revolut counterparty](https://revolutdev.github.io/business-api/?shell--sandbox#add-revolut-counterparty)

### Attempt #1

```
revolut:counterparties Adding a new counterparty +0ms
revolut:counterparties:validation Validating a revolut account +0ms
revolut:request Posting {
revolut:request "profile_type": "business",
revolut:request "name": "John Smith",
revolut:request "email": "john.gibson@revolut.com"
revolut:request } to url https://sandbox-b2b.revolut.com/api/1.0/counterparty} +0ms
```

**Response**
> 404 - {"message":"Resource not found","code":3006}

**Comment**: still unresolved

### Attempt #2

```
revolut:counterparties Adding a new counterparty +0ms
revolut:counterparties:validation Validating a revolut account +0ms
revolut:request Posting {
revolut:request "profile_type": "personal",
revolut:request "name": "John Smith",
revolut:request "phone": "+44723456789"
revolut:request } to url https://sandbox-b2b.revolut.com/api/1.0/counterparty} +0ms
```

**Response**
> 404 - {"message":"Resource not found","code":3006}

**Comment**: still unresolved

## [Non-revolut counterparty](https://revolutdev.github.io/business-api/?shell--sandbox#add-non-revolut-counterparty)

My main problem was the fact that I was missing the field `bank_country`, which seems to be essential to tell apart the account type. Docs are not clear about this. After making these changes it worked for GB and US accounts.

I was unable to add a EU counterparty with this error:

`-> 400 - {"message":"IBAN is invalid","code":3000}`

I'm not sure which validation rule is applied for IBAN accounts so I was unable to test a valid example.

I was also unable to add an 'other' counterparty as I couldn'd find a supported country code for this.

Samples for tested 'eu' and 'other' counterparties could be found [here](https://github.com/feliun/revolut/tree/master/test/fixtures/counterparties).
# Tests for counterparty messages on sandbox

I created a script to test counterparties functionalities against sandbox. The ran operations could be found [here](https://github.com/feliun/revolut/blob/master/playground/testCounterparties.js);

Please find below some issues I found while testing.

## [Revolut counterparty](https://revolutdev.github.io/business-api/?shell--sandbox#add-revolut-counterparty)

After getting your feedback, I tried adding `company_name` and `individual_name` and these are the results.

### Attempt #1

**Payload**

```
{
  "name": "John Smith Co.",
  "profile_type": "personal",
  "phone": "+44723456789",
  "email": "john@smith.co",
  "company_name": "ACME Ltd"
}
```

**Response**
> 400 - {"message":"Invalid request","code":3000}

**Comment**: still unresolved

### Attempt #2

**Payload**

```
{
  "name": "John Smith Co.",
  "profile_type": "personal",
  "phone": "+44723456789",
  "email": "john@smith.co",
  "individual_name": {
      "first_name": "John",
      "last_name": "Smith"
  }
}
```

**Response**
> 400 - {"message":"Invalid request","code":3000}

**Comment**: still unresolved

## [Non-revolut counterparty](https://revolutdev.github.io/business-api/?shell--sandbox#add-non-revolut-counterparty)

My main problem was the fact that I was missing the field `bank_country`, which seems to be essential to tell apart the account type. Docs are not clear about this. After making these changes it worked for GB and US accounts.

I was unable to add a EU counterparty with this error:

`-> 400 - {"message":"IBAN is invalid","code":3000}`

I'm not sure which validation rule is applied for IBAN accounts so I was unable to test a valid example.

I was also unable to add an 'other' counterparty as I couldn'd find a supported country code for this.

Samples for tested 'eu' and 'other' counterparties could be found [here](https://github.com/feliun/revolut/tree/master/test/fixtures/counterparties).
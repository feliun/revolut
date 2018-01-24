# Tests for counterparty messages on sandbox

I created a script to test counterparties functionalities against sandbox. The ran operations could be found [here](https://github.com/feliun/revolut/blob/master/playground/testCounterparties.js);

Please find below some issues I found while testing.

## [Non-revolut counterparty](https://revolutdev.github.io/business-api/?shell--sandbox#add-non-revolut-counterparty)

My main problem was the fact that I was missing the field `bank_country`, which seems to be essential to tell apart the account type. Docs are not clear about this. After making these changes it worked for GB and US accounts.

I was unable to add a EU counterparty with this error:

`-> 400 - {"message":"IBAN is invalid","code":3000}`

I'm not sure which validation rule is applied for IBAN accounts so I was unable to test a valid example.

I was also unable to add an 'other' counterparty as I couldn'd find a supported country code for this.

Samples for tested 'eu' and 'other' counterparties could be found [here](https://github.com/feliun/revolut/tree/master/test/fixtures/counterparties).
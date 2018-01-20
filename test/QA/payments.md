# Tests for payments messages on sandbox

I created a script to test payments functionalities against sandbox. The ran operations could be found [here](https://github.com/feliun/revolut/blob/master/bin/playground.js#L46-L53);

The only problem I found happened when I tried to test a payment, with this error:

```
400 - {"message":"Bank transfers are disabled at this moment. Please wait for a full account setup.}
```
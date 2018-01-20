# Tests for accounts messages on sandbox

I created a script to test webhooks functionalities against sandbox. The ran operations could be found [here](https://github.com/feliun/revolut/blob/master/playground/testWebhooks.js);

The `setup` operation failed with the following error:

```
400 - {"message":"Cannot construct instance of `com.revolut.stark.b2b.resources.webhook.CreateWebhookRequest` (although at least one Creator exists): no String-argument constructor/factory method to deserialize from String value ('http://localhost:3000/myendpoint')\n at [Source: (String)\"\"http://localhost:3000/myendpoint\"\"; line: 1, column: 1]","code":3000}
```

I'm not sure what the requirement to setup a webhook is.
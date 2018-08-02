# miner_wamp_client
WAMP implementation to utilize BFGMiner RPC API


Assumes Bfgminer is running on local machine with api-listen set to true.

Client connectes to WAMP router specified in minerWamp.js and registers it's publicly available functions:
```
{hostname}.getSummary()
{hostname}.getDevices()
{hostname}.getPools()
```
Client will publish the results of these calls as a second event (i.e {hostname}.summary,{hostname}.pool,{hostname}.device).

Any other client that wishes to call a miner's methods and receive the response must also be subscribed to the corresponding topic.

For example:

cleintA would like to call 'getSummary' every 20 seconds and do something with the results:

```

function onUpdate(args){
  console.log(args[0]);
}

connection.onopen = function(session){
  session.subscribe('scryptminer1.summary',onUpdate);
  setInterval(function(){
    session.call('scryptminer1.getSummary').then(console.log,console.error);
  },20000);
}

```

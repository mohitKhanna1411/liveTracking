# system-usage (for linux)

##Installation
```javascript
npm install system-usage 
```

##Usage
```javascript
var usage = require("system-usage");

var stream = usage.createStream();
stream.pipe("cpu", process.stdout);
```

##Option
```javascript
var option = { 
	interval: 300,
	percent: true 
};

var stream = usage.createStream(option);
```
>`interval`: ms
>
> `percent`: FALSE: 0.0 ~ 1.0, TRUE: 0 ~ 100


##Methods
###readStat(callback) return { cpu: { idle, total }, cpu0, memory, ...
```javascript
usage.readStat(function(results) {
    console.log(results);
});
```
###availableTypes(callback) return [ 'memory', 'cpu', 'cpu0', ... ]
```javascript
usage.availableTypes(function(list) {
	console.log(list);
});
```
###createStream(option) return stream
```javascript
var stream = usage.createStream();
```
###stream.pipe(type, writable)
```javascript
var stream = usage.createStream();
stream.pipe("cpu", process.stdout);
```

##Plot.ly 

> Live Streaming Example from https://www.npmjs.org/package/plotly

```javascript
Plotly.plot(data, graphOptions, function (err, resp) {
    if (err) return console.log("ERROR", err)

    console.log(resp)

    var plotlystream = Plotly.stream(token, function () {})
    var signalstream = usage.createStream(); // <-


    plotlystream.on("error", function (err) {
        signalstream.destroy()
    })

    // Okay - stream to our plot!
    signalstream.pipe("cpu", plotlystream)
})
```

####For multiple trace
```javascript
Plotly.plot(data, graphOptions, function (err, resp) {
    if (err) return console.log("ERROR", err)

    console.log(resp)

    var signalstream = usage.createStream(); // <-

    var cpustream = Plotly.stream(token, function () {})
    cpustream.on("error", function (err) {
        signalstream.destroy()
    })

    var memorystream = Plotly.stream(token2, function () {})
    memorystream.on("error", function (err) {
        signalstream.destroy()
    })
    
    // Okay - stream to our plot!
    signalstream.pipe("cpu", cpustream)
    signalstream.pipe("memory", memorystream)
})
```

###plotlyStream(username, apiKey, data, graphOptions, callback)
```javascript
var graphOptions = {
    "filename": "usage"
  , "fileopt": "overwrite"
  , "world_readable": true
};
usage.plotlyStream(username, apiKey, [token1, token2, token3], graphOptions, function(err, msg) {
	console.log(msg);
});
```
OR
```javascript
var graphOptions = {
    "filename": "usage"
  , "fileopt": "overwrite"
  , "world_readable": true
};
var data = [
    {
    	x: [], y: [], 
    	name: "CPU%", 
    	type: "cpu", 
    	stream: { 	
    		token: token1, 
			maxpoints: 50 
		}
	},
    {
    	x: [], y: [], 
    	name: "Memory%", 
    	type: "memory", 
    	stream: { 	
    		token: token2, 
			maxpoints: 50 
		}
	}
];
usage.plotlyStream(username, apiKey, data, graphOptions, function(err, msg) {
	console.log(msg);
});
```

Demo https://plot.ly/~mtjddnr/16

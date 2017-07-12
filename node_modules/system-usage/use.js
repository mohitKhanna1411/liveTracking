var usage = require("system-usage");

usage.availableTypes(function(list) {
	console.log(list);
});

var stream = usage.createStream();
stream.pipe("cpu", process.stdout);
(function() {
	var Readable = require('readable-stream').Readable,
		inherits = require('util').inherits,
		fs = require( 'fs' ),
		os = require('os');
	require("date-format-lite");
	
	module.exports = {
		readStat: readStat,
		availableTypes: availableTypes,
		createStream: usage,
		plotlyStream: function(username, apiKey, data, graphOptions, callback) {
			var plotly = require('plotly')(username, apiKey);
			data = data.map(function(item) {
				if (typeof item == "string") {
					item = { 
						x: [], y: [], name: null,
						stream: { 
							token: item, 
							maxpoints: 50 
						}
					};
				} 
				return item;
			});
			
			availableTypes(function(list) {
				var traces = [];
				for (var i = 0; i < data.length && list.length > 0; i++) {
					var trace = data[i];
					if (trace.type) {
						var index = list.indexOf(trace.type);
						if (index != -1) {
							list.splice(index, 1);
						} else {
							trace = null;					
						}
					} else {
						trace.type = list.shift();
						trace.name = trace.type;
					}
					if (trace) traces.push(trace);
				}
				plotly.plot(traces, graphOptions, function (err, msg) {
					if (err) { return callback ? callback(err, msg) : null; }
						
					var usageStream = usage({ interval: 300, percent: true });
					
					traces.map(function(item) { 
						var stream = plotly.stream(item.stream.token); 
						usageStream.pipe(item.type, stream);
						stream.on("error", function (err) {
							usageStream.destroy();
						});
					});	
					callback ? callback(err, msg) : null;
				});	
			});
			return plotly;
		}
	};
	function readStat(callback) {
		fs.readFile("/proc/stat", function(err, data) {
			var dLines = data.toString().split("\n"); 	
			var cpus = {};	
			for (var i = 0; i < dLines.length; i++) {
				var dRaw = dLines[i].split(' ');
				var type = dRaw[0];
				if (type.indexOf("cpu") == -1) break;
					
				var d = [], idx = 1, count = 0;
				while (count < 4) {
					var t = parseInt(dRaw[idx]);
					if (t) {
						count++;
						d.push(t);
					}
					idx++;
				}
					
				var idle = parseInt(d[3]), total = parseInt(d[0]) + parseInt(d[1]) + parseInt(d[2]);

				cpus[type] = { total: total, idle: idle };
			}
			callback(cpus);
		});
	}
	function availableTypes(callback) {
		readStat(function(data) {
			var o = [ "memory" ];
			for (var type in data) o.push(type);
			return callback(o);
		});
	}
	
	function usage(option) {
		if (option == null) option = {};
		if ((this instanceof usage) == false) return new usage(option);
		
		var $ = this;
		$._destroyed = false;
		$.interval = null;
		
		$.data = null;
		
		var interval = option.interval || 50,
			sep = (typeof(option.sep) === 'string') ? option.sep : "\n",
			percent = option.percent || false;
			
		$.streams = null;
			
		$.pipes = {};
		$.pipe = function(type, std) {
			if ($.streams == null || $.streams[type] == null) {
				$.pipes[type] = std;
			} else {
				$.streams[type].pipe(std);
			}
		};
		
		$.interval = setInterval(function() {
			readStat(function(cpus) {
				if ($.streams == null) {
					$.streams = {};
					for (var type in cpus) $.streams[type] = new Readable(option);
					$.streams['memory'] = new Readable(option);
					for (var type in $.streams) Readable.call($.streams[type], option);
					for (var type in $.pipes) if ($.streams[type]) $.streams[type].pipe($.pipes[type]);
				} else {
					var x = new Date().format("YYYY-MM-DD hh:mm:ss.SS");
					for (var type in cpus) {
						if ($.data[type] != null) {
							var cpu = cpus[type];
							var y = (cpu.total - $.data[type].total) / (cpu.total + cpu.idle - $.data[type].total - $.data[type].idle);
							if (percent) y = Math.round(y * 100);
							
							var data = { x: x, y: y };
							if (!option.objectMode) {
								data = JSON.stringify(data) + sep
								data = new Buffer(data, 'utf8');
							}
							$.streams[type].push(data);
						}
					}	
					var y = (os.totalmem() - os.freemem()) / os.totalmem();
					if (percent) y = Math.round(y * 100);
					
					var data = { x: x, y: y };
					if (!option.objectMode) {
						data = JSON.stringify(data) + sep
						data = new Buffer(data, 'utf8');
					}				
					$.streams['memory'].push(data);
				}
				$.data = cpus;
			});
		}, interval);
		
		
	}
	
	Readable.prototype._read = function () {
		if (this._destroyed) this.push(null);
	};
	
	usage.prototype.destroy = function () {
		if (this._destroyed) return;
		clearInterval(this.interval);
		this._destroyed = true;
		for (var type in this.streams) {
			this.streams[type]._destroyed = true;
			this.streams[type].emit("end");
		}
	};
	
})();
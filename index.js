//declaration
var app = require('express')();
var path = require('path');
var mongoose = require('mongoose');
var cpuStat = require('cpu-stat');
var memory = require("memory");
var geodist = require('geodist')
var geolocation = require('geolocation');
var fs = require('fs');
var https = require('https');
var options = {
	key  : fs.readFileSync('server.key'),
	cert : fs.readFileSync('server.crt')
};
var server = https.createServer(options, app);
var io = require('socket.io')(server);

//mongodb connection
mongoose.connect('mongodb://localhost/myDB');
//document schema
var mySchema = mongoose.Schema({
	socketId        : String, 
	devId           : String,
	latitude        : Number,
	longitude       : Number,
	status          : String,
	speed           : Number,
	time            : Number,
	date            : Number,
	unixTimeStamp   : String
});
//model declaration
var myModel = mongoose.model('myCollection', mySchema);
var connectCounter= 0 ;

//intial function
app.get('/', function(req, res){
	var express=require('express');
	app.use(express.static(path.join(__dirname)));
	res.sendFile(path.join(__dirname,'assets/public/index.html'));

});

	// 1.1 CPU utilization API

app.get('/api/systemHeathCPU', function(req,res,next){
	var abc = parseInt(req.query.seconds);
	cpuStat.usagePercent({},
		function(err, percent, seconds) {
			if (err) {
				return console.log(err);
			}
			res.send(JSON.stringify(percent));
		});
});

 	// 1.2 Memory utilization API

app.get('/api/systemHeathMEM', function(req,res,next){
 	var mem = memory();
 	console.log("Memory usage: ", mem);
 	res.send(JSON.stringify(mem));
});

	// 2 Listing unique devices API

app.get('/api/listDevices', function(req,res,next){
	myModel.distinct("devId",(function(err, docs){
		console.log(docs);
		res.send(JSON.stringify(docs));
	}))
});

	// 3 Geo Position API

app.get('/api/geoPosition', function(req,res,next){
	console.log(req.query);
	myModel.find({$and :[{"devId" : req.query.device},
		{"time" : { $gt : parseInt(req.query.start) , $lt : parseInt(req.query.end) } }
		]},
		function(req,docs){
			console.log(docs);
			res.send(JSON.stringify(docs));
		});
});

	// 4 Geo Overspeeding API

  app.get('/api/geoOverspeeding', function(req,res,next){
	myModel.find({$and :[{"speed" : { $gt : 60 }},
	{"time" : { $gt : parseInt(req.query.start) , $lt : parseInt(req.query.end) } } ]},
	function(request,docs){
		var devArray = [];
		for(var i=0;i<docs.length;i++){
			devArray[i] = docs[i].devId;
		}
		res.send(JSON.stringify(devArray.filter( onlyUnique )));
		function onlyUnique(value, index, self) { 
			return self.indexOf(value) === index;
		}
	});
});

	// 5 Geo Dwell API

app.get('/api/geoDwell', function(req, res){
	var lt = parseFloat(req.query.lat);
	var ln = parseFloat(req.query.lon);
	myModel.find( {"time" : { $gt : parseInt(req.query.start) , $lt : parseInt(req.query.end) } } ,function(request,docs){
		var distArray = [];
		var ctr = 0 ;
		for(var i=0;i<docs.length;i++){
			var loc1 = {lat: lt, lon: ln}    
			var loc2 = {lat: docs[i].latitude, lon: docs[i].longitude}
			var dist = geodist(loc1, loc2, {exact: true, unit: 'km'})
		    if(dist < 10){
		    	distArray[ctr] = docs[i].devId ; 
		    	ctr++;
		    }
		}//for loop
	res.send(JSON.stringify(distArray.filter( onlyUnique )));
	function onlyUnique(value, index, self) { 
		return self.indexOf(value) === index;
	}
	});
});

	// 6 Stationary Filter API

 app.get('/api/stationaryFilter', function(req,res,next){
	myModel.find({$and :[{"speed" : { $eq : 0 }},
	{"time" : { $gt : parseInt(req.query.start) , $lt : parseInt(req.query.end) } }
	]}, function(request,docs){
		var devArray = [];
		for(var i=0;i<docs.length;i++){
			devArray[i] = docs[i].devId;
		}
		res.send(JSON.stringify(devArray.filter( onlyUnique )));
		function onlyUnique(value, index, self) { 
			return self.indexOf(value) === index;
		}
	});
});

	// 7 Socket Disconnect API

app.get('/api/disconnect', function(req, res, next){
  	console.log('status ',req.query.st);
  	console.log('socketId', req.query.socketId);
  	var hex_st = null;
  	if(req.query.st == 'false'){
  		hex_st = toHex('Disconnected');
  	}
	myModel.update( { socketId: req.query.socketId},
	{ $set: { status: hex_st } },
	{ multi: true },
	function(err, object) {
	if (err){
          console.warn(err.message);  // returns error if no matching object found
      }else{
      	res.send('ok');
      }
  });
});
  function toHex(str) {
  	var hex = '';
  	for(var i=0;i<str.length;i++) {
  		hex += ''+str.charCodeAt(i).toString(16);
  	}
  	return hex;
  }

//Multi-client socket connection

io.on('connection', function(socket){ 
	connectCounter++;
	var clients= "Device00"+connectCounter;
	var st = null;
	console.log('clients    ', clients);
	if(socket.connected == true)
		st = 'Connected';
	else
		st = 'Disconnected';

	var http = require('http');
	var url = 'http://ip-api.com/json';
	function makeCall (url, callback) {
		http.get(url,function (res) {
			res.on('data', function (d) {
				callback(JSON.parse(d));
			});
			res.on('error', function (e) {
				console.error(e);
			});
		});
	}

//converting string to hex
	function toHex(str) {
		var hex = '';
		for(var i=0;i<str.length;i++) {
			hex += ''+str.charCodeAt(i).toString(16);
		}
		return hex;
	}
	var c = 1;

	//function repeats itself every 10 seconds
	var timeout = setInterval(function() {

makeCall(url, function(results){

	var date = new Date();
	var hour = date.getHours();
	hour = (hour < 10 ? "0" : "") + hour;

	var min  = date.getMinutes();
	min = (min < 10 ? "0" : "") + min;

	var sec  = date.getSeconds();
	sec = (sec < 10 ? "0" : "") + sec;

	var year = date.getFullYear();

	var month = date.getMonth() + 1;
	month = (month < 10 ? "0" : "") + month;

	var day  = date.getDate();
	day = (day < 10 ? "0" : "") + day;

	var today_time = hour + min + sec;
	var today_date = year + month + day ;

	console.log('saving............', (c-1) ,'  time(s) for ',clients);
	
	//calling handlefunction
	handleResults(clients,results.lat,results.lon,toHex(st),today_date,today_time,socket.id);

});//makecall function
		c++;
		if (c > 50) {
			clearInterval(timeout);
		}
  }, 10000);//timeout function
});//socket-connection function

//saves the data into moongoose
function handleResults(devId,lat,lon,status,date,time,socketId){

 var newModel = new myModel();
 newModel.socketId = socketId;
 newModel.devId = devId;
 newModel.latitude = lat;
 newModel.longitude = lon;
 newModel.status = status;
 newModel.time = time;
 newModel.date = date;
 newModel.unixTimeStamp = Date.now();
 newModel.speed  = randomIntInc(0,70);

 newModel.save(function(err,savedObject){
 	if(err){
 		console.log(err);
 	}
 	else{
 		console.log(savedObject);
 	}
 });
}//handle function

//random number generation
function randomIntInc (low, high) {
	return Math.floor(Math.random() * (high - low + 1) + low);
}

// Listen application request on port 3000
server.listen(3000, function () {
	console.log('listening on *:3000');
});
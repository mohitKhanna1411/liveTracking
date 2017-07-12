# NUMADIC ASSIGNMENT


Numadic Assignment is a full-stack developer test given by NUMADIC IOT PVT. LTD. for the assesment of the candidate(i.e MOHIT KHANNA). This project is all about knowing the details of the client which gets connected to the server. By fetching the details such as Latitude, Longitude, Speed, TimeStamp, Status etc We can perform many tasks which gets us to know our client much better.

Also this assignment(product) is a multi-client web application where number of clients get connected to the server and the server then fetch some details about the client and thus produces desired results accordingly.

This product is used to find 
1. Local-Sys Health in a given time which can be studied to improve the performance of the server.
2. The device name which all are connected to our server.
3. Geo-Position of a particular connected client which can be studied to track the client.
4. Geo-Overspeeding of a particular connected client in a given time frame.
5. The list of devices which are within 10km range of the provided coordinates and time range.
6. Get a list of devices which are stationary for more than 2mins.



## Prerequisites

For this product to run we need to have set of softwares installed on our system(for Ubuntu 16.04 LTS) like
1. NODEJS and NPM
	$ sudo apt-get install python-software-properties
	$ curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
	$ sudo apt-get update
	$ sudo apt-get install nodejs
	
2. MONGODB
	$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
	$ sudo apt-get update
	$ sudo apt-get install -y mongodb-org

3. NODE MODULES

a) Express Framework
	$ npm install -g express-generator

b) Multi-client Sockets
	$ sudo npm install socket.io

c) Mongoose
	$ npm install mongoose

d) CPU-Stat
	$ npm install cpu-stat

e) Memory
	$ npm install memory

f) Geodist
	$ npm install geodist

g) Path
	$ npm install --save path

h) Http
	$ npm install http

i) Nodemon
	$ npm install -g nodemon

j) File-System
	$ npm install fs

## Quick Start

1. 	Open Terminal
2.	Go to the directory where the project is kept
3.	$ nodemon index.js
4.	Now, Go to browser [if no error is seen on the terminal]
5.	localhost:3000
6.	Web-app started [if everything is OK]

## What's included

Within the Directory you'll find the following directories and files:

```
Numadic/
├── assets/
|   ├── css/
|   |   ├── animate.min.css
|   |   ├── bootstrap.min.css
|   |   ├── demo.css
│   |   ├── light-bootstrap-dashboard.css
│   |   └── pe-icon-7-stroke.css
|   ├── js/
|   |   ├── bootstrap-checkbox-radio-switch.js
|   |   ├── bootstrap-notify.js
|   |   ├── bootstrap-select.js
|   |   ├── bootstrap.min.js
│   |   ├── chartist.min.js
│   |   ├── light-bootstrap-dashboard.js
│   |   ├── jquery-1.10.2.js
│   |   ├── script.js
│   |   └── client.js
|   ├── public/
|   |   ├── index.html
|   |   ├── geoDwell.html
|   |   ├── sysHealth.html
│   |   ├── stationaryFilter.html
│   |   ├── geoOverspeeding.html
│   |   ├── listDevices.html
│   |   ├── geoPosition.html
│   |   └── disconnect.html
|   ├── fonts/
|   |    ├── Pe-icon-7-stroke.eot
|   |    ├── Pe-icon-7-stroke.svg
|   |    ├── Pe-icon-7-stroke.ttf
|   |    └── Pe-icon-7-stroke.woff
|   ├── KEYS/
|   |    ├── server.crt
|   |    ├── server.csr
|   |    ├── server.enc.key
|   |    ├── server.key
|   |    └── STEPS.txt
|   └── img/
├── node_modules/
|   ├── local packages
|
├── index.js
├── package.json
├── server.crt
├── server.key
├── KEYPAIRS.txt
├── nginx setup and configuration.txt
└── Readme.md


## Built With

Express Framework
Nodejs
Mongodb

## Version
 V1 0.0.1 - 8th April 2017
 V2 0.1.1 [current version]

##Credits

Template Credits :

Creative Tim: <http://www.creative-tim.com/products>

## License

- Copyright 2017 MK Mohit Khanna

## Useful Links

Bitbucket : <https://bitbucket.org/Mohit_khanna>

Social Media :

Facebook : <https://www.facebook.com/mohit.khanna.92754>

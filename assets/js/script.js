// creating the module
  var myApp = angular.module('myApp', ['ngRoute']);
// configuring routes
  myApp.config(function($routeProvider, $locationProvider){
    $routeProvider
    .when('/sysHealth', {
      templateUrl : '/assets/public/sysHealth.html',
      controller  : 'mainController'
    })
    .when('/listDevices', {
      templateUrl : '/assets/public/listDevices.html',
      controller  : 'listController'
    })
    .when('/geoPosition', {
      templateUrl : '/assets/public/geoPosition.html',
      controller  : 'geoController'
    })
    .when('/geoOverspeeding', {
      templateUrl : '/assets/public/geoOverspeeding.html',
      controller  : 'speedController'
    })
    .when('/geoDwell', {
      templateUrl : '/assets/public/geoDwell.html',
      controller  : 'dwellController'
    })
    .when('/stationaryFilter', {
      templateUrl : '/assets/public/stationaryFilter.html',
      controller  : 'filterController'
    });

    $locationProvider.html5Mode(true);
  });

// creating mainController
  myApp.controller('mainController', function($scope, $http) {
    $scope.disconnect = function() {
      socket.disconnect();    
      socket.close();
      $http.get("/api/disconnect", { params: { st : socket.connected, socketId : socket.io.engine.id } } )
      .success(function(res) {
        console.log('Disconnecting');
        if(res== 'ok');
        alert("Disconnecting from the server");
        window.open("/assets/public/disconnect.html", '_self');
      })

    };
    $scope.submit = function() {
      $scope.result1 = 0 ;
      $scope.result2 = 0 ;
      $scope.message = null;
      console.log($scope.start, $scope.end);
      if($scope.start < $scope.end){
        var sec = $scope.end - $scope.start;
// calling node API '/api/systemHeathCPU'
        $http.get('/api/systemHeathCPU', { params: { seconds : sec } }).success(function(res){
          $scope.result1 = res;
        })
// calling node API '/api/systemHeathMEM'
        $http.get('/api/systemHeathMEM').success(function(res){
          $scope.result2 = res;
        })
      }else
      $scope.message="End Time should be greater than start time";
    };
  });

//creating listController
  myApp.controller('listController', function($scope,$http) {
// calling node API '/api/listDevices'
    $scope.message3 = null;
    $http.get('/api/listDevices').success(function(res){
      if(res.length == 0){
        $scope.message3 = "Currently No Devices are connected";
        return;
      }
      $scope.list = res;
    })
  });

//creating geoController
  myApp.controller('geoController', function($scope, $http) {
    $scope.message1 = null;
    $scope.submit = function() {
      $scope.list = [];
// calling node API '/api/geoPosition'
      $http.get('/api/geoPosition',{ params: {start : $scope.start , end : $scope.end , device : $scope.device } })
      .success(function(res){
        if(res.length==0)
        {
          $scope.message1 = 'No Result found Try with different values';
          return;
        }
        for(var i = 0 ; i< res.length ; i++){
          $scope.list.push({
            "latitude" : res[i].latitude,
            "longitude": res[i].longitude,
            "status"   : hex2a(res[i].status),
            "unixTimeStamp": new Date(parseInt(res[i].unixTimeStamp)).toGMTString(),
            "speed" : res[i].speed
          });
        }
        //declaring function
        function hex2a(hex) {
          var str = '';
          for (var i = 0; i < hex.length; i += 2) {
            var v = parseInt(hex.substr(i, 2), 16);
            if (v) str += String.fromCharCode(v);
          }
          return str;
        }
      })
    };
  });

//creating dwellController
  myApp.controller('dwellController', function($scope, $http) {
   $scope.message2 = null;
   $scope.submit = function() {
// calling node API '/api/geoDwell'
    $http.get('/api/geoDwell',{ params: { start : $scope.start, end : $scope.end, lat : $scope.lat, lon : $scope.lon } })
    .success(function(res){
        if(res.length == 0){
          $scope.message2= "No Devices found Try Again!";
          return;
        }
        $scope.list = res ;
      })
  };
});

//creating speedController
  myApp.controller('speedController', function($scope, $http) {
   $scope.message4 = null;
   $scope.submit = function() {
// calling node API '/api/geoOverspeeding'
    $http.get('/api/geoOverspeeding',{ params: { start : $scope.start, end : $scope.end} })
    .success(function(res){
     console.log(res);
     if(res.length == 0){
      $scope.message4= "No Devices found Try Again!";
      return;
    }
    $scope.list = res ;
  })
  };
});

//creating speedController
  myApp.controller('filterController', function($scope, $http) {
   $scope.message4 = null;
   $scope.submit = function() {
// calling node API '/api/stationaryFilter'
    $http.get('/api/stationaryFilter',{ params: { start : $scope.start, end : $scope.end} })
    .success(function(res){
     console.log(res);
     if(res.length == 0){
      $scope.message4 = "No Devices found Try Again!";
      return;
    }
    $scope.list = res ;
  })
  };
});
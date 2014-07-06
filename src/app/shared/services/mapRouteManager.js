app.service('MapRouteManager', function($rootScope, MapCenterManager){

  var dest = null;

  this.rendererOptions   = { 
    'draggable': true, 
    'preserveViewport': true
  };

  this.directionsDisplay = new google.maps.DirectionsRenderer(this.rendererOptions);

  this.directionsService = new google.maps.DirectionsService();

  this.getDestination = function(){ return dest; };
  
  this.setDestination = function(position){ dest = position }; 

  this.init = function(map){
    this.directionsDisplay.setMap(map); 
    google.maps.event.addListener(this.directionsDisplay, 'directions_changed', 
      function(MapCenterManager, MapRouteManager){
        return function() { MapCenterManager.set(MapRouteManager.getDestination()); };
      }(MapCenterManager, this)
    );

  };

  this.get = function(orig, dest){
    this.setDestination(dest);
    request = {
      'origin'      : orig,
      'destination' : this.getDestination(),
      'travelMode'  : google.maps.TravelMode.WALKING 
    };
    this.directionsService.route(request, function(MapRouteManager){
      return function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          MapRouteManager.directionsDisplay.setDirections(response);
        }
      }
    }(this));
    $rootScope.$on('dragend:home', function(MapRouteManager){
      return function(event){ 
        debugger;
        MapRouteManager.directionsDisplay.setMap(null);
      }
    }(this));

  }
});
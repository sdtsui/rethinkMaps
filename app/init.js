/**
 * Helper Functions :
 */

/**
 * Renders React components based on development status (data.js)
 * @return {[type]} [description]
 */
var renderComponents = function() {
  if (!__DEV._SEARCHOFF) {
    var places = __LOCAL_MAP_DATA.__ALL_LOCATIONS.reduce(function(locations, rdb_doc) {
      var newLoc = {
        placeName : rdb_doc.doc.placeName
      };
      locations.push(newLoc);
      return locations;
    }, []);

    React.render(<FilterableLocationsTable locations={places} />, 
      document.getElementById('searchContainer'));
  }
  React.render(<GoogleMap/>, 
    document.getElementById('mapContainer'));
}

/**
 * Predicate to determine if nodes nearby
 * @param  {[type]}  place [description]
 * @param  {[type]}  index [description]
 * @return {Boolean}       [description]
 */
var isNearby = function(place, index) {
  return !!(place.dist < __LOCAL_MAP_DATA.maximumPinDistance)
}

/**
 * Forces coordinates to Mock, or uses geolocation results.
 * @param  {[type]} position [description]
 * @return {[type]}          [description]
 */
var determineLatLng = function(position) {
  var latLng = null;
  if (__DEV._MOCK.SanFrancisco) {
    console.log('Developer Mode: San Francisco Mock');
    result = {
      latitude : __DEV._MOCK.sfLatLong[0],
      longitude: __DEV._MOCK.sfLatLong[1]
    }
  } else if (__DEV._MOCK.Seattle) {
    console.log('Developer Mode: Seattle Mock');
    result = {
      latitude : __DEV._MOCK.seaLatLong[0],
      longitude: __DEV._MOCK.seaLatLong[1]
    }
  } else {
    result = position.coords;
  }
  
  return result;
};

/**
 * Fetching and Rendering Logic
 * @param  {[type]} navigator.geolocation [description]
 * @return {[type]}                       [description]
 */
if (navigator.geolocation) {
  if (!__DEV._MAPOFF) {
    //Map is ON:
    navigator.geolocation.getCurrentPosition(function(position) {
      var coordinates = determineLatLng(position);
      //1st AJAX call to send location to server
      var fetchMapData = $.ajax({
          url: "/locations/insertOne",
          type: "POST",
          data: {latLong : JSON.stringify([coordinates.latitude,
           coordinates.longitude])},
          dataType: "json"
      });

      //then center map
      fetchMapData
        .then(function(res, type) {
          var coordinates = res;
          __LOCAL_MAP_DATA.mapCenterLat = coordinates[0];
          __LOCAL_MAP_DATA.mapCenterLng = coordinates[1];
          console.log(__LOCAL_MAP_DATA);
        })
      //then get all of the locations and render
        .then(function() {
          //2nd AJAX call for locations to search
          return $.ajax({
          url: "/locations/allLocations",
          type: "POST",
          data: {latLong : JSON.stringify([coordinates.latitude,
           coordinates.longitude])},
          dataType: "json"
          })
          .done(function(res, type) {
            __LOCAL_MAP_DATA.__ALL_LOCATIONS = res;
            __LOCAL_MAP_DATA.__NEARBY_LOCATIONS = res.filter(isNearby);
          });
        })
        .done(renderComponents);
    });
  } else {
    console.log('Dev Mode: Map Off');
  }
} else {
  console.log("HTML5 geolocation is not supported by this browser.");
}

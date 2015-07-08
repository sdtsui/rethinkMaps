if (navigator.geolocation) {
  if (!__DEV._MAPOFF) {
    /**
     * Reminder: Use Mocks to override location to Seattle or San Francisco
     */
    navigator.geolocation.getCurrentPosition(function(position) {
      var coordinates = position.coords;
      console.log('dev :',__DEV);
      if (__DEV._MOCK.SanFrancisco) {
        console.log('SF Mock');
        coordinates = {
          latitude : __DEV._MOCK.sfLatLong[0],
          longitude: __DEV._MOCK.sfLatLong[1]
        }
      }
      if (__DEV._MOCK.Seattle) {
        console.log('SEA Mock');
        coordinates = {
          latitude : __DEV._MOCK.seaLatLong[0],
          longitude: __DEV._MOCK.seaLatLong[1]
        }
      }

      /**
       * Ajax Request to server.
       * @type {[type]}
       */
      var map_fetch_promise = $.ajax({
          url: "/locations/insertOne",
          type: "POST",
          data: {latLong : JSON.stringify([coordinates.latitude,
           coordinates.longitude])},
          dataType: "json"
        })

      map_fetch_promise
        .then(function(res, type) {
          console.log("DONE :", res);
          console.log('type :', type);
          var coordinates = res;
          __LOCAL_MAP_DATA.mapCenterLat = coordinates[0];
          __LOCAL_MAP_DATA.mapCenterLng = coordinates[1];
          console.log(__LOCAL_MAP_DATA);
          console.log('done setting user location');
        })
        .then(function() {
          console.log('Get all the things');
          //get all of the locations
          return $.ajax({
          url: "/locations/allLocations",
          type: "POST",
          data: {latLong : JSON.stringify([coordinates.latitude,
           coordinates.longitude])},
          dataType: "json"
          })
          .done(function(res, type) {
            console.log('inside done of GET ajax');
            console.log("DONE :", res);
            __LOCAL_MAP_DATA.__ALL_LOCATIONS = res;
            __LOCAL_MAP_DATA.__NEARBY_LOCATIONS = 
              __LOCAL_MAP_DATA.__ALL_LOCATIONS.filter(function(location, index) {
                return (location.dist < 40);
              });
            console.log('length of nearby : ', __LOCAL_MAP_DATA.__NEARBY_LOCATIONS.length);
          })
        })
        .done(renderMapAndSearch);
    });
  } else {
    console.log('Dev Mode: Map Off');
  }
} else {
  console.log("HTML5 geolocation is not supported by this browser.");
}

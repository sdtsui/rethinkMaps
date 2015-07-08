var renderMapAndSearch = function() {
  console.log('Rendering Maps');

  if (!__DEV._SEARCHOFF) {
    var allLocs = __LOCAL_MAP_DATA.__ALL_LOCATIONS
    allLocs = __LOCAL_MAP_DATA.__ALL_LOCATIONS.reduce(function(locations, rdb_doc) {
      var newLoc = {
        placeName : rdb_doc.doc.placeName
      };
      locations.push(newLoc);
      return locations;
    }, []);
    console.log('ALLLOCS :', allLocs);
    React.render(<FilterableLocationsTable locations={allLocs} />, 
      document.getElementById('searchContainer'));
  }
  React.render(<GoogleMap/>, 
    document.getElementById('mapContainer'));
}

var GoogleMap = React.createClass({
  getDefaultProps: function () {
    return __LOCAL_MAP_DATA;
  },
  componentDidMount: function (rootNode) {
    var mapOptions = {
      center: this.mapCenterLatLng(),
      zoom: this.props.initialZoom
    };

    map = new google.maps.Map(this.getDOMNode(), mapOptions);
    this.props.__NEARBY_LOCATIONS.forEach(function(location, index) {
      var newPoint = new google.maps.Marker({
        position: this.localPointLatLng(index),
        title: 'Stored Location',
        map: map
      });
    }.bind(this));
    var marker = new google.maps.Marker({
      position: this.mapCenterLatLng(), 
      title: 'User Location', 
      map: map,
    });

    this.setState({map: map});
  },
  mapCenterLatLng: function () {
    var props = this.props;

    return new google.maps.LatLng(props.mapCenterLat, props.mapCenterLng);
  },
  localPointLatLng: function(idx) {
    var props = this.props;
    var newPin = {
      lat: props.__NEARBY_LOCATIONS[idx].doc.point.coordinates[1],
      lng: props.__NEARBY_LOCATIONS[idx].doc.point.coordinates[0] 
    };
    return new google.maps.LatLng(newPin.lat, newPin.lng);
  },
  render: function () {
    return (<div className='mapCanvas'></div>);
  }
});

if (navigator.geolocation) {
    //Assign's user location to a global variable before rendering.
    if (!__DEV._MAPOFF) {
      /**
       * Reminder: Use Mocks to lock location to Seattle or San Francisco
       */

      navigator.geolocation.getCurrentPosition(function(position) {
        var coordinates = position.coords;
        console.log('sending Data:', {latLong : JSON.stringify([coordinates.latitude,
             coordinates.longitude])});
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
         * NOW, GET ALL THE THINGS. 
         * Then add points.
         * Pass all the points to React's component prop.
         * Search. DONE.
         */


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
        console.log('mapfetch then ');
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
        console.log('waiting');
      });
    } else {
      console.log('Dev Mode: Map Off');
    }
} else {
    console.log("Geolocation is not supported by this browser.");
}

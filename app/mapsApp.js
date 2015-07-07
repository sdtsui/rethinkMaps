var __USER_LOCATION = {
  initialZoom: 11 //Refactor: hardcoded calculation
};

var handleClick = function() {
  console.log('click');
}

var GoogleMap = React.createClass({
  getDefaultProps: function () {
    return __USER_LOCATION;
  },
  componentDidMount: function (rootNode) {
    var mapOptions = {
      center: this.mapCenterLatLng(),
      zoom: this.props.initialZoom
    },
    map = new google.maps.Map(this.getDOMNode(), mapOptions);
    var marker = new google.maps.Marker({position: this.mapCenterLatLng(), title: 'Hi', map: map});
    this.setState({map: map});
  },
  mapCenterLatLng: function () {
    var props = this.props;

    return new google.maps.LatLng(props.mapCenterLat, props.mapCenterLng);
  },
  render: function () {
    return (<div className='mapCanvas' onClick={handleClick}></div>);
  }
});

if (navigator.geolocation) {
    //Assign's user location to a global variable before rendering.
    if (!__DEV_MAPOFF) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var coordinates = position.coords;
        console.log('sending Daata:', {latLong : JSON.stringify([coordinates.latitude,
             coordinates.longitude])});

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
        var request = $.ajax({
          url: "/locations/insertOne",
          type: "POST",
          data: {latLong : JSON.stringify([coordinates.latitude,
           coordinates.longitude])},
          dataType: "json"
        });

        request.done(function(res, type) {
          console.log("DONE :", res);
          console.log('type :', type);
          var coordinates = res;
          __USER_LOCATION.mapCenterLat = coordinates[0];
          __USER_LOCATION.mapCenterLng = coordinates[1];
          console.log(__USER_LOCATION);

          console.log('done');
          React.render(<GoogleMap/>, 
            document.getElementById('mapContainer'));
        });
        console.log('waiting');
      });
    } else {
      console.log('Dev Mode: Map Off');
    }
} else {
    console.log("Geolocation is not supported by this browser.");
}

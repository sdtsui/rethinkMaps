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
        $.AJAX

        var request = $.ajax({
          url: "/locations",
          type: "POST",
          data: {latLong : JSON.stringify([coordinates.latitude,
           coordinates.longitude])},
          dataType: "json"
        });

        request.done(function(res, type) {
          console.log("DONE :", res);
          console.log('type :', type);
          // enqueuedTweets = res.filter(function(newTweet) {
          //   var found = false;
          //   seenTweets.forEach(function(seenTweet) {
          //     if (seenTweet.tweetID === newTweet.tweetID){
          //       found = true;
          //     }
          //   });
          //   return !found; //want the ones that are not found
          __USER_LOCATION.mapCenterLat = coordinates.latitude;
          __USER_LOCATION.mapCenterLng = coordinates.longitude;
          console.log(__USER_LOCATION);


          React.render(<GoogleMap/>, 
            document.getElementById('mapContainer'));
          });
      });
    } else {
      console.log('Dev Mode: Map Off');
    }
} else {
    console.log("Geolocation is not supported by this browser.");
}

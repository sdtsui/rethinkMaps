var GoogleMap = React.createClass({
  getDefaultProps: function () {
    return __LOCAL_MAP_DATA;//global: see data.js and init.js
  },
  componentDidMount: function (rootNode) {
    var mapOptions = {
      center: this.mapCenterLatLng(),
      zoom: this.props.initialZoom
    };

    map = new google.maps.Map(this.getDOMNode(), mapOptions);

    //drop a pin for each nearby location
    this.props.__NEARBY_LOCATIONS.forEach(function(location, index) {
      var newPoint = new google.maps.Marker({
        position: this.localPointLatLng(index),
        title: 'Stored Location',
        map: map
      });
    }.bind(this));

    //drop a marker for the user & use center of map
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
  //create a new maps LatLng object, for pin creation in componentDidMount
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

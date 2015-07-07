var r = require('../database/rethinkdbConnection');
var geocoder = require('geocoder');


var getLocationCount = function(data, callback) {
  r.table('locations').count().run(r.conn, function(err, data) {
    if(err) {
      return callback && callback(err, null);
    }
    return callback && callback(null, data);
  });
}

var getAllLocations = function(data, callback) {
  r.table('locations').count().run(r.conn, function(err, data) {
    console.log('getAllLocations data:', data);
    if(err) {
      console.log('getAllLocations err', err);
      return callback && callback(err, null);
    }
    return callback && callback(null, data);
  });
}


var getLocationsNearby = function(data, callback) {
  //from point, radius
};

var insertOneLocation = function(data, callback) {
  var coordinatesArray = JSON.parse(data.latLong);
  //Note: Signature: Lat and Long reversed
  var queryPoint = r.point(coordinatesArray[1], coordinatesArray[0]);
  // console.log('queryPoint :', queryPoint);
  

  r.db('locations')
    .table('locations')
    .getNearest(queryPoint, {index: 'point', maxResults: 1, unit: 'mi', maxDist: 0.2})
    .run(r.conn)
    .then(function(results, error) {
      if (error ){ 
        throw new Error(error);
      } 
      console.log('geoNearest Results : ', results);

      //Inserting only if a unique point, 0.2mi away from an existing point.
      if (results.length > 0) {
        console.log("LOCATION ALREADY EXISTS, not inserting :")
        //use the user's location, even if close to an existing point
        return callback && callback(null, coordinatesArray);  
      } else {
        //insert into database : geoCode first
        console.log('FOUND DUPLICATE : geocode!!');
        geocoder.reverseGeocode(coordinatesArray[0], coordinatesArray[1], function (err, data) {
          if (err) {console.log('err :', err);};
          var readableAddress = data
                                  .results[0]
                                  .formatted_address;
          r.db('locations')
            .table('locations')
            .insert([
              {
                placeName : readableAddress,
                point : queryPoint
              }
            ])
            .run(r.conn)
            .then(function(results, error){
              if (error) {console.log('insertion error: ', error);}
              console.log('results: ', results);
              console.log('geocoded!!');
              return callback && callback(null, coordinatesArray);
            });
        });
      }
    });
};


module.exports = {
  getAllLocations : getAllLocations,
  getLocations: getLocationsNearby,
  insertOneLocation: insertOneLocation,
  getLocationCount: getLocationCount
};
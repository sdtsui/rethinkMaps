var r = require('../database/rethinkdbConnection');
var geocoder = require('geocoder');

/**
 * Returns an in-order list of 100 nearest locations for the client to search from.
 * mapsApp also uses this endpoint and filters out locations too far away.
 * @param  {[type]}   data     [An array of LatLngs to query from.]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
var getLocationsNearby = function(data, callback) {
  var coordinatesArray = JSON.parse(data.latLong);
  var queryPoint = r.point(coordinatesArray[1], coordinatesArray[0]);

  r.db('locations')
    .table('locations')
    .getNearest(queryPoint, {
      index: 'point', 
      maxResults: 100, 
      unit: 'mi', 
      maxDist: 1000
    })
    .run(r.conn)
    .then(function(results, error) {
      console.log('results.length :', results.length);
      return callback && callback(null, results);
    })
    .catch(function(err){
      if (error){
        throw new Error(error);
      }
    });

};

/**
 * Inserts one location. 
 * Checks for a valid insert by querying the DB first for nearby points.
 * If inserting a new location:
 *  uses geocoder to save a placeName, not only coordinates.
 * @param  {[type]}   data     [An array of LatLngs to query from.]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
var insertOneLocation = function(data, callback) {
  var coordinatesArray = JSON.parse(data.latLong);
  var queryPoint = r.point(coordinatesArray[1], coordinatesArray[0]);

  r.db('locations')
    .table('locations')
    .getNearest(queryPoint, {
      index: 'point', 
      maxResults: 1, 
      unit: 'mi', 
      maxDist: 0.2
    })
    .run(r.conn)
    .then(function(results, error) {
      //Inserting only if a unique point, 0.2mi away from an existing point.
      if (results.length > 0) {
        //Use the user's location, even if close to an existing point
        return callback && callback(null, coordinatesArray);  
      } else {
        //Insert into database after geocoding
        geocoder.reverseGeocode(coordinatesArray[0], coordinatesArray[1], 
          function (err, data) {
            if (err) {console.log('err :', err);};
            var readableAddress = data.results[0].formatted_address;
            r.db('locations')
              .table('locations')
              .insert([
                {
                  placeName : readableAddress,
                  point : queryPoint
                }
              ])
              .run(r.conn)
              .then(function(results, err){
                if (err) {throw new Error(err);}
                //Always send back the user's location so the app can load.
                return callback && callback(null, coordinatesArray);
              });
          });
      }
    })
    .catch(function(err) {
      if (err) {
        throw new Error(err);
      }
    });

};

module.exports = {
  getLocationsNearby: getLocationsNearby,
  insertOneLocation: insertOneLocation
};

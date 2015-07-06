var r = require('../database/rethinkdbConnection');


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

var getLocations = function(data, callback) {
  //from point, radius
};

var insertLocation = function(data, callback) {
  //write tests to seed database: insert all locations...
}

module.exports = {
  getAllLocations : getAllLocations,
  getLocations: getLocations,
  insertLocation: insertLocation
};
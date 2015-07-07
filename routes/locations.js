var express = require('express');
var locationsRouter = express.Router();
var locationsController = require('../controllers/locationsController');

locationsRouter
  .get('/', function(request, response) {
    console.log('inside get to locations, sending back JSON');

    locationsController.getLocationsNearby(null, function(err, data) {

      console.log('locationsController callback: err :data', err, data);
      if (err) {
        console.log('locationsRouter Error: ', err);
        return response.send("ERROR :", err);
      }
      return response.send(JSON.parse(data));
    });
  })
  .post('/insertOne', function(request, response) {
    console.log('locations POST');
    console.log('request body :', request.body);

    locationsController.insertOneLocation( request.body, function(err, data) {
      if (err) {
        console.log('err: ', err);
      } else {
        console.log('sending back...');
        response.status(201);
        return response.send(JSON.stringify(data));
      }
    });

  });

console.log('exporting locationsRouter');
module.exports = locationsRouter;





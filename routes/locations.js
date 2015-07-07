var express = require('express');
var locationsRouter = express.Router();
var locationsController = require('../controllers/locationsController');

locationsRouter
  //Returns all locations
  .post('/allLocations', function(request, response) {
    locationsController.getLocationsNearby(request.body, function(err, data) {
      if (err) {
        throw new Error(err);
      }

      return response.send(JSON.stringify(data));
    });

  })
  //Handles a single location insert.
  .post('/insertOne', function(request, response) {
    locationsController.insertOneLocation(request.body, function(err, data) {
      if (err) {
        throw new Error(err);
      } else {
        response.status(201);
        return response.send(JSON.stringify(data));
      }
    });

  });

module.exports = locationsRouter;

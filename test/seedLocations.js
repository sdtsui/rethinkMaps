//Contains seed locations for demo. Incomplete. Not yet geocoded.
var superRequest = require('supertest')('http://localhost:9000');
//SF seeds are pre-geocoded. Seattle seeds are not.
//
var __SF_SEED = [
  {
    placeName: "2001 Hillside Blvd, Colma, CA 94014",
    location : [37.680573, -122.446698]
  },
  {
    placeName: "300 Finley Road, San Francisco, CA 94129",
    location : [37.788773, -122.460603]
  },
  {
    placeName: "99 Harding Rd, San Francisco, CA 94132",
    location : [37.724035, -122.492532]
  },
  {
    placeName: "100 John F Shelley Dr, San Francisco, CA 94134",
    location : [37.719146, -122.421121]
  },
  {
    placeName: "2300 Junipero Serra Blvd, Daly City, CA 94015",
    location : [37.697689, -122.477425]
  }
];
var __SEA_SEED = [
  {
    placeName: "Sunny in Seattle",
    location : [47.6208895,-122.2939226]
  },
  {
    placeName: "Sunny in Seattle22",
    location : [47.6163768,-122.3128912]
  },
  {
    placeName: "Sunny in Seattle333",
    location : [47.624939,-122.3400137]
  },
  {
    placeName: "Sunny in Seattle4444",
    location : [47.6092598,-122.3207017]
  },
  {
    placeName: "Simon's Apartment",
    location : [47.61658651, -122.3520824]
  }
];

/**
 * Insert all seed locations:
 * 
 * @type {[type]}
 */
var __SEEDS = __SF_SEED.concat(__SEA_SEED);
var sendPostForSingleObject = function(seedObject, index) {
  superRequest
    .post('/locations/insertOne')
    .send({latLong : JSON.stringify(
      [
      seedObject.location[0],
      seedObject.location[1]
      ]
      )}
    )
    .end(function(err, res){
      if (err) {throw new Error(err);}
      //"Attempted" because will fail on repeat insertion.
      //Please see the insert check conditions in 
      //'../controllers/locationsController'.
      console.log('Attempted to insert coordinates from index:', index);
      return;
    });
};
__SEEDS.forEach(sendPostForSingleObject);

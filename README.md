# reThinkMaps
reThinkMaps - Full-Stack Application in reThinkDB, Node/Express, and React, for BloomSky, on 07-06.  
Uses jQuery, Google Maps API, Supertest, rethinkdb-init, and node-geocoder.

###Deployment Instructions:
1. `clone` the repo
2. `npm install`
3. `rethinkdb` (`rethinkdb-init` auto-initializes a `locations` db, with a `locations table` )
4. `node index.js` or `nodemon index.js`
5. (optional - `supertest` required) to seed the database with hardcoded San Francisco and Seattle Locations, run `node test/seedLocations.js`
6. (optional) - to override your browser's geolocation data, flip the `__DEV._MOCK.SanFrancisco` or `__DEV._MOCK.Seattle` booleans to load a map centered in those cities
7. (optional) check the status of the rethinkdb instance by navigating to `localhost:8080`. If step 5 was completed correctly, the `locations` table should have some documents.
8. navigate to `localhost:9000`

####Minor Points:
- Front-end:
  - Screen uses `display : flex`, but is not yet responsive.
- Back-end: 
  - Data conversion between LatLng using tuples could have been better done with an object. For example:  `{ lt: 34, lg:-122 }`
  - A traditional schema for reThinkDB is possible, but seems unnecessary with `rethink-init`. See `database/rethinkdbConnection.js`, which defines `db` and `table`s.
- Architecture:
  - I decided to only use `POST` requests because the client always needs to transmit its location in case it is new (and needs to be saved). Thus, `locations` controller doesn't respond to `GET` requests.
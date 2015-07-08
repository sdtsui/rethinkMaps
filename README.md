# reThinkMaps
reThinkMaps - Full-Stack Application in reThinkDB, Node/Express, and React, for BloomSky, on 07-06.  
Uses jQuery, Google Maps API, Supertest, rethinkdb-init, and node-geocoder.

###Deployment Instructions:
1. `clone` the repo
2. `npm install`
3. `rethinkdb` (`rethinkdb-init` auto-initializes a `locations` db, with a `locations table` )
4. `node index.js` or `nodemon index.js`
5. (optional - `supertest` required - see `test/seedLocations.js`) to seed the database with hardcoded San Francisco and Seattle Locations, run `node test/seedLocations.js`
6. (optional - mocks - see `app/data.js`) - to override your browser's geolocation data, flip the `__DEV._MOCK.SanFrancisco` or `__DEV._MOCK.Seattle` booleans to load a map centered in those cities
7. (optional - reThinkDB GUI) check the status of the rethinkdb instance by navigating to `localhost:8080`. If step 5 was completed correctly, the `locations` table should have some documents.
8. navigate to `localhost:9000`
9. Try to search! Typing in "Seattle" and "San Francisco" will filter for stored locations in that city!

####Minor Points:
- Frontend:
  - Contents of data.js made development easier. Abstracting into a parent component would be a great first refactor step. Ideally, this would involve Flux. (I did not expect to have time to learn both React and Flux.)
  - For the same reasons as above, jQuery's AJAX promises were used to fetch from the server for speed of development, and would ideally be replaced.
  - Screen uses `display : flex`, but is not yet responsive.
- Backend: 
  - A traditional schema for reThinkDB is possible, but seems unnecessary with `rethink-init`. See `database/rethinkdbConnection.js`, which defines `db` and `table`s.
  - `/locations/insertOneLocation` 's nested promise callback is readable, but could be cleaner, more functional style. In a production application, geocoder would likely be used more, abstracted out, and make nesting promise unnecessary.
- Architecture:
  - I decided to only use `POST` requests because the client always needs to transmit its location (in case it is new and needs to be saved). Thus, `locations` controller doesn't respond to `GET` requests.
  - API Quirks: Google Maps/Geocoder and reThinkDB's geoSpatial querying reverse the order of LatLng numbers. Data conversion between `LatLng` using tuples could have been better done with an object. For example:  `{ lat: 34, lng:-122 }`
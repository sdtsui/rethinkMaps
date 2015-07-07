var q = require('q');
var r = require('rethinkdb');
require('rethinkdb-init')(r);

/**
 * Initialzies the database with:
 * DB: 'locations'
 * Table(s): 'locations'
 *   Indexes: 'placeName, point'
 * See the rethinkdb-init docs on NPM.
 * @type {String}
 */
r.init({
  host: 'localhost', 
  port: 28015, 
  db: 'locations'}, 
  [
    {
      name: 'locations',
      indexes: [
        {
          name: 'placeName'
        },
        {
          name: 'point',
          geo: true
        }
      ]
    }
  ])
  .then(function (conn) {
    console.log('reThinkDB Initialized...');
    r.conn = conn;
  });

module.exports = r;

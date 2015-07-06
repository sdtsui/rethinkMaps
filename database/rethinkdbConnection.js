var q = require('q');
var r = require('rethinkdb');
require('rethinkdb-init')(r);

r.init({
  host: 'localhost', 
  port: 28015, 
  db: 'locations'}, 
  [
    {
      name: 'locations',
      indexes: [{
        name: 'place',
        geo: true
      }]
    }
  ])
    .then(function (conn) {
      console.log('all tables created');
      r.conn = conn;
      r.conn.use(config.get('rethinkdb').db);
      console.log('all tables created');
    });

module.exports = r;
var bodyParser = require('body-parser');
var cors = require('cors');
var express      = require('express');
var app          = express();
var port         = process.env.PORT || 9000;

var locationsRouter = require('./routes/locations');
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname));

app.use('/locations', locationsRouter);


app.listen(port);
console.log('Listening on PORT ' + port + '....');

module.exports = app;

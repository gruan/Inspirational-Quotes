// set up =============================
var express    = require('express');
var app        = express();                           // create our app w/express
var mongoose = require('mongoose');                   // mognoose for mongodb
var morgan = require('morgan');                       // log requests to the console (express4)
var bodyParser = require('body-parser');              // pull information from HTML POST (express4)
var methodOverride = require('method-override');      // simulate DELETE and PUT(express4)

// configuration ======================

mongoose.connect('mongodb://localhost/inspirationalQuotes') // connect to mongodb

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

app.listen(8080);
console.log('App listening on port 8080');

// define model =======================
var InspirationalQuotes = mongoose.model('InspirationalQuotes', {
  text: String
});

// routes =============================
// api --------------------------------

// Get all quotes
app.get('/api/quotes', function(req, res) {
  // Use mongoose to get all quotes in the database
  InspirationalQuotes.find(function(err, quotes) {
    // if there is an error retrieving, send the error. Nothing after res.send(err) will execute
    if(err) {
      res.send(err);
    }

    res.json(quotes);
  });
});

// Create a single quote and send back all quotes after creation
app.post('/api/quotes', function(req, res) {
  // Create a todo, information comes from AJAX request from Angular
  InspirationalQuotes.create({
    text: req.body.text,
    done: false
  }, function(err, quotes) {
    if(err) {
      res.send(err);
    }

    // Get and return all the quotes after you create another
    InspirationalQuotes.find(function(err, quotes) {
      if(err) {
        res.send(err);
      }
      res.json(quotes);
    });
  });
});

// Delete a quote
app.delete('/api/quotes/:quote_id', function(req, res) {
  console.log(req.params);
  InspirationalQuotes.remove({
    _id: req.params.quote_id
  }, function(err, quotes) {
    if(err) {
      res.send(err);
    }

    // Get and return all the quotes after you removed one
    InspirationalQuotes.find(function(err, quotes) {
      if(err) {
        res.send(err);
      }
      res.json(quotes);
    });
  });
});

// Application -----------------------
app.get('*', function(req, res) {
  res.sendfile('./public/index.html');      // Load the single view file (angular will handle the page changes on the front-end)
})

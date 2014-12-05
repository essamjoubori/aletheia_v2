var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var mongojs = require('mongojs');
var db = mongojs('hack_project', ["mentors"]);
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017');

require('./models/Students');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.post('/mentor', jsonParser, function(req, res){
    console.log('called from server.js');
    console.log('res', JSON.stringify(req.body.name));
    db.mentors.insert(req.body, function(err, doc){
      console.log(doc)
      res.send(doc);
    });

});

app.get('/mentor', function(req, res){
    db.mentors.find(function(err, docs){
      console.log('docs from get', docs )
      res.send(docs);
    })
});

app.get('/api/students', function(req, res){
  Student.find(function(err, students){
    if (err) {
      res.send(err);
    }
    res.json(students);
  });
});

app.post('/api/students', function(req, res){
  Student.create({
    name: req.body.name
  }, function(err, student){
    if (err) {
      res.send(err);
    }
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
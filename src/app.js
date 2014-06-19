var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var app = express();

app.mysql = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'sleepytorrentdownload'
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* GET home page. */
app.get('/', function(req, res) {

  app.mysql.query('SELECT t.*, f.filename AS f_filename, f.filesize AS f_filesize \
  FROM torrent t \
  LEFT JOIN files f \
    ON f.torrentid = t.id \
  WHERE t.deletedat IS NULL \
  ORDER BY f.filename', function(err, results) {
    if(!err) {
      var currentid = 0;
      var torrents = [];
      var lastindex = -1;
      for(var i = 0; i < results.length; i++) {
        var current = results[i];
        if(currentid != current.id) {
          currentid = current.id;
          current.f_filename = [current.f_filename];
          current.f_filesize = [current.f_filesize];
          torrents.push(current);
          lastindex++;
        } else {
          torrents[lastindex].f_filename.push(current.f_filename);
          torrents[lastindex].f_filesize.push(current.f_filesize);
        }

      }
      res.render('index', { torrents: torrents });
    } else {
      console.log(err);
    }
  });
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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

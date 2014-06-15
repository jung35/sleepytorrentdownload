var express = require('express');
var router = express.Router();
var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'sleepytorrentdownload'
});

/* GET home page. */
router.get('/', function(req, res) {

  connection.query('SELECT t.*, \
    (SELECT GROUP_CONCAT(CONCAT(\'{"name":"\', f.filename, \'", "size":"\',f.filesize,\'"}\')) \
      FROM files f WHERE t.id = f.torrentid) AS files \
  FROM torrent t \
  WHERE t.deletedat IS NULL', function(err, results) {
    if(!err) {
      res.render('index', { torrents: results });
    } else {
      console.log(err);
    }
  });
});

module.exports = router;

var torrentStream = require('torrent-stream');
var fs = require('fs');
var Buffer = require('buffer').Buffer;
var async = require('async');

var lastPiece = null, currPiece = null, pieceCount = 0;
var numPiece = 0, highestPiece = 0;

var currDownSize = 0;
var currDownSpeed = 0;

var currUpSize = 0;
var currUpSpeed = 0;

var url = 'magnet:?xt=urn:btih:d89d08d448efa0827cce742ef9efae47076cee53&dn=Game+of+Thrones+Season+1%2C2%2C3+complete+&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80&tr=udp%3A%2F%2Ftracker.istole.it%3A6969&tr=udp%3A%2F%2Fopen.demonii.com%3A1337';

var opt = {
    connections: 100,     // Max amount of peers to be connected to.
    tmp: 'C:/wamp/www/sleepytorrentdownload/src',          // Root folder for the files storage.
    path: 'C:/wamp/www/sleepytorrentdownload/src/download', // Where to save the files. Overrides `tmp`.
};

var engine = torrentStream(url, opt);

engine.on('ready', function() {
  numPiece = engine.torrent.pieces.length;

  engine.files.forEach(function(file) {
    stream = file.createReadStream();
  });

  async.whilst(function () {
    return true;
  },
  function (callback) {
    currDownSize = engine.swarm.downloaded;
    currDownSpeed = engine.swarm.downloadSpeed();

    currUpSize = engine.swarm.uploaded;
    currUpSpeed = engine.swarm.uploadSpeed();

    if(lastPiece != currPiece) {
      lastPiece = currPiece;
      console.log('\033[2J');
      engine.files.forEach(function(file) {
        console.log('file:', file.path);
      });
      console.log("Piece", pieceCount, "/", numPiece);

      console.log("Download Size", currDownSize, "Speed", currDownSpeed);
      console.log("Upload Size", currUpSize, "Speed", currUpSpeed);
    }

    if(pieceCount >= numPiece) {
      engine.destroy();
      process.exit();
    }
    setTimeout(callback, 1);
  },
  function (err) {
        // 5 seconds have passed
  });

});

engine.on('download', function(piece) {
  currPiece = piece;
  pieceCount++;
});

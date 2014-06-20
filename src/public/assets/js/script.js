$('.torrent-list').on('click', 'li', function() {
  var $this = $(this);
  if(!$this.hasClass('selected')) {
    var torrentId = $(this).attr('id').split('-')[2];

    $('.torrent-list > li').removeClass('selected');
    $this.addClass('selected');

    $('.torrent-info > li').hide();
    $('#torrent-info-'+torrentId).show();

    if($this.hasClass('allow-download') && $('#downloadFile').hasClass('invisible')) {
      $('#downloadFile').removeClass('invisible');
    } else {
      $('#downloadFile').addClass('invisible');
    }

  } else {
    $this.removeClass('selected')
    $('.torrent-info > li').hide();
    if(!$('#downloadFile').hasClass('invisible')) {
      $('#downloadFile').addClass('invisible');
    }
  }
});

$('#main-menu').on('click', '.addNewTorrent', function() {
  $('.torrent-list > li').removeClass('selected');
  $('.torrent-info > li').hide();
  $('#downloadFile').addClass('invisible');
  $('#addNewTorrent').show();
});

function moreTorrents() {
  var optionsCount = $('.torrent-add').size()+1;
  var optionsFormat = '<div class="torrent-add"> \
  <div class="form-group"> \
    <label for="torrent-name-'+optionsCount+'" class="col-sm-2 control-label">File Name '+optionsCount+'</label> \
    <div class="col-sm-10"> \
      <input type="text" class="form-control" id="torrent-name-'+optionsCount+'" placeholder="File Name"> \
    </div> \
  </div> \
  <div class="form-group"> \
    <label for="torrent-magnet-'+optionsCount+'" class="col-sm-2 control-label">Magnet Link '+optionsCount+'</label> \
    <div class="col-sm-10"> \
      <input type="text" class="form-control" id="torrent-magnet-'+optionsCount+'" placeholder="Magnet Link"> \
    </div> \
  </div> \
</div>';
  $('.torrent-add-option').before(optionsFormat);
}

function clearTorrents() {
  var optionsCount = 1;
  var optionsFormat = '<div class="torrent-add"> \
  <div class="form-group"> \
    <label for="torrent-name-'+optionsCount+'" class="col-sm-2 control-label">File Name '+optionsCount+'</label> \
    <div class="col-sm-10"> \
      <input type="text" class="form-control" id="torrent-name-'+optionsCount+'" placeholder="File Name"> \
    </div> \
  </div> \
  <div class="form-group"> \
    <label for="torrent-magnet-'+optionsCount+'" class="col-sm-2 control-label">Magnet Link '+optionsCount+'</label> \
    <div class="col-sm-10"> \
      <input type="text" class="form-control" id="torrent-magnet-'+optionsCount+'" placeholder="Magnet Link"> \
    </div> \
  </div> \
</div>';

  $('.torrent-add').remove();
  $('.torrent-add-option').before(optionsFormat);
}

function getSimpleByte(num) {
  if(num > 1073741824) {
    num = parseFloat(num / 1073741824.0).toFixed(2) + ' GB';
  } else if(num > 1048576) {
    num = parseFloat(num / 1048576.0).toFixed(2) + ' MB';
  } else if(num > 1024) {
    num = parseFloat(num / 1024.0).toFixed(2) + ' KB';
  } else {
    num += ' B';
  }

  return num;
}

var socket = io();
var $newTorrentForm = $('#addNewTorrent .torrent-add-form');
$('form.torrent-add-form').submit(function() {
  var optionsCount = $('.torrent-add').size();

  var torrent = [];

  for(var x = 1; x <= optionsCount; x++) {
    var tName = $newTorrentForm.find('#torrent-name-'+x).val(),
        tMagnet = $newTorrentForm.find('#torrent-magnet-'+x).val();

    if(typeof tName === 'string' &&
       typeof tMagnet === 'string' &&
       tName.length > 0 &&
       tMagnet.length > 0)
    {
      torrent.push({
        name: tName,
        magnet: tMagnet
      });
    }
  }


  socket.emit('newTorrent', torrent, function(err) {
    if(err) {
      var invTorrents = '';
      for(var x = 0; x < err.length; x++) {
        invTorrents += '<br>' + err[x];
      }
      $('#alertBox').find('.modal-body').html('<b>Invalid Magnet Link</b>' + invTorrents);
      $('#alertBox').modal('show');
    }
  });
  clearTorrents();
  return false;
});

/*****************
******************
******************
******************

var $torrentList = $('.torrent-list'),
    $torrentInfo = $('.torrent-info');
socket.on('newTorrent', function(torrent) {
  var date = new Date(torrent.time);
  var daynight = date.getHours() - 11 > 0 ? 'PM' : 'AM';

  var sum = 0;
  var fileNames = '';

  for(var x = 0; x < torrent.files.length; x++) {
    sum += torrent.files[x].size;
    fileNames += '\r\n'+ torrent.files[x].path + '  --  '+getSimpleByte(torrent.files[x].size);
  }

  sum = getSimpleByte(sum);

  var listFormat = '<li id="torrent-view-'+torrent.id+'"> \
  <div class="row"> \
    <div class="col-sm-12 torrent-list-name">#'+torrent.id+' '+torrent.name+'</div> \
  </div> \
  <div class="row text-muted"> \
    <div class="col-sm-6 torrent-list-files">Files: '+torrent.files.length+'</div> \
    <div class="col-sm-6 torrent-list-size">Estimated Size: '+sum+'</div> \
  </div> \
  <div class="row"> \
    <div class="col-sm-12 torrent-list-progress"> \
      <span class="text-muted">In Queue</span> \
    </div> \
  </div> \
</li>';

  var infoFormat = '<li id="torrent-info-'+torrent.id+'"> \
  <h2>#'+torrent.id+' '+ torrent.name +' <small>Added ' + date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate() + ' '+(date.getHours() - (daynight == 'PM' && date.getHours()-12 > 0 ? 12:0))+':'+date.getMinutes()+' '+daynight+'</small></h2> \
  <fieldset><legend>Files <small class="text-muted">'+torrent.files.length+'</small></legend> \
    <pre>'+fileNames+'</pre> \
  </fieldset> \
  <fieldset><legend>Download</legend> \
    <dl class="col-xs-6 dl-horizontal text-monospaced"> \
      <dt>Progress</dt> \
      <dd>In Queue</dd> \
    </dl> \
    <dl class="col-xs-6 dl-horizontal text-monospaced"> \
      <dt>Ratio (dl/up)</dt> \
      <dd>&infin;</dd> \
    </dl> \
    <dl class="col-xs-6 dl-horizontal text-monospaced"> \
      <dt>Downloaded</dt> \
      <dd>&infin;</dd> \
      <dt>Avg. Download Speed</dt> \
      <dd>&infin;</dd> \
    </dl> \
    <dl class="col-xs-6 dl-horizontal text-monospaced"> \
      <dt>Uploaded</dt> \
      <dd>&infin;</dd> \
      <dt>Avg. Upload Speed</dt> \
      <dd>&infin;</dd> \
    </dl> \
    <dl class="col-xs-6 dl-horizontal text-monospaced"> \
      <dt>Info Hash</dt> \
      <dd>'+torrent.hash+'</dd> \
    </dl> \
    <dl class="col-xs-12 dl-horizontal text-monospaced"> \
      <dt>Finished Download</dt> \
      <dd>- - -</dd> \
      <dt>Finished Compressing</dt> \
      <dd>- - -</dd> \
    </dl> \
  </fieldset> \
  <fieldset><legend></legend> \
    <button onClick="javascript:doDelete(4);" type="button" class="btn btn-danger btn-lg btn-block">Delete Torrent</button> \
  </fieldset> \
</li>';

  $torrentList.append(listFormat);
  $torrentInfo.append(infoFormat);
});

*************************
*************************
*************************
************************/

function doDelete(id) {
  socket.emit('delTorrent', id, function(err) {
    if(err) {
      $('#alertBox').find('.modal-body').html('<b>Error Deleting Torrent</b>');
      $('#alertBox').modal('show');
    }
  });
}

socket.on('delTorrent', function(id) {

  $('#torrent-view-'+id).remove();
  $('#torrent-info-'+id).remove();

});

$('.torrent-info-file-list').on('click', function() {
  $(this).find('.file-list-pre').slideToggle('slow');
});

$(function() {
  $('.file-list-pre').hide('fast');
});

socket.on('torrentProgress', function(data) {
  var updatedInfo = data[0];
  var currentTorrentId = data[1];
  var torrentView = $('#torrent-view-'+currentTorrentId).find('.torrent-list-progress');
  var torrentInfo = $('#torrent-info-'+currentTorrentId);
  var downloadProgress, atProgress = false;

  if(updatedInfo.downloadedat) {
    var downloadDate = new Date(updatedInfo.downloadedat * 1000);
    var downloadAbb = downloadDate.getHours() > 11 ? 'PM' : 'AM';
    var downloadText =  downloadDate.getFullYear() + '/' + ( downloadDate.getMonth()+1) + '/' +  downloadDate.getDate() + ' '+( downloadDate.getHours() - (downloadAbb == 'PM' &&  downloadDate.getHours()-12 > 0 ? 12:0))+':'+ (downloadDate.getMinutes() < 10 ? '0'+downloadDate.getMinutes() : downloadDate.getMinutes()) +' '+downloadAbb;
  }

  if(updatedInfo.compressedat) {
    var compressDate = new Date(updatedInfo.compressedat * 1000);
    var compressAbb = compressDate.getHours() > 11 ? 'PM' : 'AM';
    var compressText =  compressDate.getFullYear() + '/' + ( compressDate.getMonth()+1) + '/' +  compressDate.getDate() + ' '+( compressDate.getHours() - (compressAbb == 'PM' &&  compressDate.getHours()-12 > 0 ? 12:0))+':'+ (compressDate.getMinutes() < 10 ? '0'+compressDate.getMinutes() : compressDate.getMinutes()) +' '+compressAbb;
  }

  if(updatedInfo.compressedat) {
    downloadProgress = '<span class="text-success">Ready For Download</span>';
  } else if(updatedInfo.downloadedat) {
    downloadProgress = '<span class="text-primary">Compressing File</span>';
  } else if(updatedInfo.pieces > 0) {
    atProgress = true;
    downloadProgress = '<div class="progress progress-striped active"> \
    <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="'+ Math.round(updatedInfo.dlpieces / updatedInfo.pieces * 100)+'%" aria-valuemin="0" aria-valuemax="100" style="width: '+ Math.round(updatedInfo.dlpieces / updatedInfo.pieces * 100)+'%"> \
      <span> '+ Math.round(updatedInfo.dlpieces / updatedInfo.pieces * 100)+'% Complete</span> \
    </div> \
  </div>';
  } else {
    downloadProgress = '<span class="text-muted">In Queue</span>';
  }

  torrentView.html(downloadProgress);
  if(atProgress) {
    torrentInfo.find('.torrent-info-download-progress').html(Math.round(updatedInfo.dlpieces / updatedInfo.pieces * 100)+'%');
  } else {
    torrentInfo.find('.torrent-info-download-progress').html(downloadProgress);
  }

  torrentInfo.find('.torrent-info-ratio').html(updatedInfo.dlsize && updatedInfo.upsize ? (updatedInfo.dlsize/updatedInfo.upsize).toFixed(4) : '&infin;');
  torrentInfo.find('.torrent-info-dlsize').html(updatedInfo.dlsize ? getSimpleByte(updatedInfo.dlsize) : '&infin;');
  torrentInfo.find('.torrent-info-dlspeed').html(updatedInfo.dlspeed ? getSimpleByte(updatedInfo.dlspeed) : '&infin;');
  torrentInfo.find('.torrent-info-upsize').html(updatedInfo.upsize ? getSimpleByte(updatedInfo.upsize) : '&infin;');
  torrentInfo.find('.torrent-info-upspeed').html(updatedInfo.upspeed ? getSimpleByte(updatedInfo.upspeed) : '&infin;');
  torrentInfo.find('.torrent-info-downloadedat').html(updatedInfo.downloadedat ? downloadText : '- - -');
  torrentInfo.find('.torrent-info-compressedat').html(updatedInfo.compressedat ? compressText : '- - -');
});

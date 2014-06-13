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
      <input name="torrent['+optionsCount+'][name]" type="text" class="form-control" id="torrent-name-'+optionsCount+'" placeholder="File Name"> \
    </div> \
  </div> \
  <div class="form-group"> \
    <label for="torrent-magnet-'+optionsCount+'" class="col-sm-2 control-label">Magnet Link '+optionsCount+'</label> \
    <div class="col-sm-10"> \
      <input name="torrent['+optionsCount+'][magnet]" type="text" class="form-control" id="torrent-magnet-'+optionsCount+'" placeholder="Magnet Link"> \
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
      <input name="torrent['+optionsCount+'][name]" type="text" class="form-control" id="torrent-name-'+optionsCount+'" placeholder="File Name"> \
    </div> \
  </div> \
  <div class="form-group"> \
    <label for="torrent-magnet-'+optionsCount+'" class="col-sm-2 control-label">Magnet Link '+optionsCount+'</label> \
    <div class="col-sm-10"> \
      <input name="torrent['+optionsCount+'][magnet]" type="text" class="form-control" id="torrent-magnet-'+optionsCount+'" placeholder="Magnet Link"> \
    </div> \
  </div> \
</div>';

  $('.torrent-add').remove();
  $('.torrent-add-option').before(optionsFormat);
}

function doDelete(id) {
  var errorMessage = 'Error: Expected JSON';

  $.ajax({
    type: 'POST',
    url: '/',
    data: { id: id },
    dataType: 'json'
  })
    .done(function(data) {
      if(data.success) {
        $('#torrent-info-'+id).remove();
        $('#torrent-view-'+id).remove();
      } else {
        $('#alertBox').find('.modal-body').html(errorMessage + ' (doDelete#done)');
        $('#alertBox').modal('show');
      }
    })
    .error(function() {
      $('#alertBox').find('.modal-body').html(errorMessage + ' (doDelete#error)');
      $('#alertBox').modal('show');
    });
}

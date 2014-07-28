var tableWidths = ['15px', '32px', '20px', '100px', '28px', '35px', '36px', '16px', '28px', '24px', '22px', '12px'];
var tableClass = [
  't_check',
  't_id',
  't_server',
  't_filename',
  't_status',
  't_downloaded',
  't_filesize',
  't_seeder',
  't_speed',
  't_added',
  't_links',
  't_remove'
];

// remove iframes
Array.prototype.forEach.call(document.querySelectorAll('iframe'), function (ifr) {
  ifr.parentNode.removeChild(ifr);
});

var tableHeads = document.querySelectorAll('table thead th');
for (var i = 0; i < tableHeads.length; i++) {
  tableHeads[i].removeAttribute('style');
  tableHeads[i].style.width = tableWidths[i];
  // tableHeads[i].classList.add(tableClass[i]);
}

// reorder #displaydllink
var displayLink = document.querySelector('#displaydllink'),
    torrentWrap = document.querySelector('#torrent_wrapper');
torrentWrap.parentNode.insertBefore(displayLink, torrentWrap);

// remove small table lengths: dataTables_length
Array.prototype.forEach.call(document.querySelectorAll('.dataTables_length select option'), function (opt) {
  if (opt.value !== '100') {
    opt.parentNode.removeChild(opt);
  }
});
// now trigger event 'change' on the selector
var longTable = document.createEvent('HTMLEvents');
longTable.initEvent('change', false, true);
document.querySelector('.dataTables_length select').dispatchEvent(longTable);

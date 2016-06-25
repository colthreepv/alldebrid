'use strict';
function parseStatus (statusStr) {
  if (typeof sizeStr !== 'string') return statusStr;
  var s = statusStr.split(' ');
  if (s[1] === 'Downloading' || s[1] === 'Uploading') {
    return s[0];
  }
  if (statusStr === 'In Queue') {
    return 'queue';
  }
  return statusStr;
}

function parseSize (sizeStr) {
  if (typeof sizeStr !== 'string') return sizeStr;
  var s = sizeStr.split(' ');
  if (s.length < 2) {
    console.log.error('debug this torrent size', sizeStr);
    return sizeStr;
  }
  var multiplier;
  switch (s[1]) {
  case 'Bytes':
    multiplier = 1;
    break;
  case 'KB':
    multiplier = 1024;
    break;
  case 'MB':
    multiplier = 1024 * 1024;
    break;
  case 'GB':
    multiplier = 1024 * 1024 * 1024;
    break;
  default:
    console.log.error('torrent size not handled', sizeStr, s[1]);
  }
  // try parsing quantity
  var quantity;
  try {
    quantity = parseFloat(s[0]);
  } catch (e) {
    console.log.error('parseFloat failed on', s[0]);
    return sizeStr;
  }

  quantity = quantity * multiplier;
  return Math.round(quantity);
}

function parseSpeed (speedStr) {
  // when in queue, ad gives 0 as Number, not string.
  if (Number.isInteger(speedStr) || speedStr === '??') {
    return 0;
  }

  var s = speedStr.match(/(\d*) (\w*)/);
  // shortcut to zero
  if (s.length && parseInt(s[1], 10) === 0) {
    return 0;
  }
  return speedStr;
}

function parseDate (dateStr) {
  var newd = new Date();
  var d = dateStr.match(/(\d{2})\/(\d{2})-(\d{2}):(\d{2})/);

  // when in queue, ad gives short-format dates
  if (d === null) {
    d = dateStr.match(/(\d{2})[ -](\d{2}):(\d{2})/);
    if (d.length) {
      newd.setDate(parseInt(d[1], 10));
      newd.setHours(parseInt(d[2], 10));
      newd.setMinutes(parseInt(d[3], 10));
    }
  } else { // all the rest
    if (d.length) {
      newd.setDate(parseInt(d[1], 10));
      newd.setMonth(parseInt(d[2], 10) - 1);
      newd.setHours(parseInt(d[3], 10));
      newd.setMinutes(parseInt(d[4], 10));
    }
  }
  // if date is in future, is probably in the past year, actually!
  if (newd > Date.now()) {
    newd.setFullYear(newd.getFullYear() - 1);
  }

  return newd;
}

function parseLinks (linksStr) {
  var slicedStr = linksStr.slice(10, -97);
  return slicedStr.split(',;,').slice(0, -1);
}

exports.status = parseStatus;
exports.size = parseSize;
exports.speed = parseSpeed;
exports.date = parseDate;
exports.links = parseLinks;

'use strict';
/**
 * References:
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function () {
  chrome.app.window.create('index.html', {
    id: 'ad-chrome'
  });
});

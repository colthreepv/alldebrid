alldebrid-chrome
================

Alternative interface for [AllDebrid][ad] as a Chrome App.  

## Install from Chrome Store

Still ongoing publishing...

## How-To Build locally
Using [bower](http://bower.io):
```bash
$ git clone https://github.com/mrgamer/alldebrid-chrome.git
$ cd alldebrid-chrome
$ bower install
```

Once bower installs all the dependencies, the App is ready to be loaded into Chrome.  
Navigate your Chrome browser to [chrome://extensions](chrome://extensions):

![how it should look like](http://i.imgur.com/57bch98.png)

  * Enable Developer Mode
  * Load unpacked extension pointing out the checkout out repository


### Known Issues

  * [AllDebrid][ad] in case of many failed logins shows a reCaptcha, and the Chrome App does not handle it currently, it only suggest to wait _several minutes_ before trying to log again.
  * It's not yet possible to upload `.torrent` files as on the standard website, not planned for now (as magnets are.. better?)

### Why
Make a frontend interface to a proprietary service, so you can add functionalities without the need of altering the original website.  
I could use some batch features, like batch delete or batch add magnets, so i started making stupid javascript scripts, but those were not really complete, so the next step would of course be... an App!


[ad]: http://www.alldebrid.com/

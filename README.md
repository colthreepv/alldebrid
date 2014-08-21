alldebrid-chrome
================

Alternative interface for [AllDebrid][ad] as a Chrome App.  

## Install from Chrome Store

[Chrome Web Store link](https://chrome.google.com/webstore/detail/pbphhfknnndbbigjgiogloieniaemoed)

## Need contributions
If anyone with graphic skills, this project would really benefit of:

  * Chrome App icon, different sizes, [128x128](https://raw.githubusercontent.com/mrgamer/alldebrid-chrome/master/icon_128.png), [48x48](https://raw.githubusercontent.com/mrgamer/alldebrid-chrome/master/icon_48.png) as you can see they are awful
  * Chrome Web Store small tile [(440x280)](https://raw.githubusercontent.com/mrgamer/alldebrid-chrome/master/store_small_tile.png), large tile (920x680)

Visibility on Chrome Web Store will attract more contributors, so better graphics equals better App.  

__Credits for contributions will be shown both here and on Chrome Web Store Application.__

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

### Roadmap
Features planned:

  * [Grunt][gruntjs] script in order to assist in `.zip` creation, making it smaller and faster to publish on Chrome Web Store

### Aim of the project
Create an user-made frontend interface to a proprietary service, so you can add functionalities without the need of altering the original website.  

[ad]: http://www.alldebrid.com/
[gruntjs]: http://gruntjs.com/

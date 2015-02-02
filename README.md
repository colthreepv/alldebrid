alldebrid-chrome
================

Alternative interface for [AllDebrid][ad] as a Chrome App.  

## [Install from Chrome Store](https://chrome.google.com/webstore/detail/alldebrid-for-desktop/pbphhfknnndbbigjgiogloieniaemoed)

## Install from this repository

Download a version from the [releases list](/releases), and unzip where you like.  
Then follow the [Load into Chrome](#load-into-chrome) steps.

## Chrome Webstore versioning

The project uses a standard [semver versioning](http://semver.org/) (`x.x.x` style), 
when published on Chrome Webstore it gains an additional minor release number, representing the number of times
it has been republished or corrected (ex: `x.x.x.8`).  
This because Chrome Webstore requires strictly increasing version values, which I agree with.

## Need contributions
If anyone with graphic skills, this project would really benefit of:

  * Chrome App icon, different sizes, [128x128](https://raw.githubusercontent.com/mrgamer/alldebrid-chrome/master/icon_128.png), [48x48](https://raw.githubusercontent.com/mrgamer/alldebrid-chrome/master/icon_48.png) as you can see they are awful
  * Chrome Web Store small tile [(440x280)](https://raw.githubusercontent.com/mrgamer/alldebrid-chrome/master/store_small_tile.png), large tile (920x680)

Visibility on Chrome Web Store will attract more contributors, so better graphics equals better App.  

__Credits for contributions will be shown both here and on Chrome Web Store Application.__

## Build locally
Using [bower](http://bower.io):
```bash
$ git clone https://github.com/mrgamer/alldebrid-chrome.git
$ cd alldebrid-chrome
$ bower install
```

## Load into Chrome
Once bower installs all the dependencies, the App is ready to be loaded into Chrome.  
Navigate your Chrome browser to [chrome://extensions](chrome://extensions):

![how it should look like](http://i.imgur.com/57bch98.png)

  * Enable Developer Mode
  * Load unpacked extension pointing out the checkout out repository

## Build system
In case you made modifications to the project, you need [Grunt](http://www.gruntjs.com) to assist in building.  
If you have node.js installed all you need to do is:
```bash
$ npm install -g grunt-cli
$ npm install
```

After you done your modifications, use grunt to:
  * Set a new version
  * Build a zip package of it

```bash
$ grunt setver --setver=x.x.x.x
$ grunt build
```

### Known Issues

  * [AllDebrid][ad] in case of many failed logins shows a reCaptcha, and the Chrome App does not handle it currently, it only suggest to wait _several minutes_ before trying to log again.
  * It's not yet possible to upload `.torrent` files as on the standard website, not planned for now (as magnets are.. better?)

### Roadmap
Features planned:

  * ~~[Grunt][gruntjs] script in order to assist in `.zip` creation, making it smaller and faster to publish on Chrome Web Store~~ DONE!

### Aim of the project
Create an user-made frontend interface to a proprietary service, so you can add functionalities without the need of altering the original website.  

[ad]: http://www.alldebrid.com/
[gruntjs]: http://gruntjs.com/

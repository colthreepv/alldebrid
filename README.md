alldebrid
=========

~~Alternative interface for [AllDebrid][ad] as a Chrome App.~~
I am moving away from Chrome App and creating a webapp that is self-hostable.
Angular.js 1.x web application that queries the original [alldebrid.com][ad] via XMLHttpRequest as `document` through a simple NGINX proxy ([configuration](config.nginx)).

![GIF Demo](https://cloud.githubusercontent.com/assets/2657230/13898314/94325992-edcd-11e5-8c89-ec3b88a94ed4.gif)

# Brilliant features
  * Natively handles `magnet:` links

A torrent application on your device is not required to download any kind of data from your favourite service.

## Roadmap

  * API built on top of express.js to abstract away the DOM parsing
  * Simpler web app (no more angular-ui-router, please)
  * App user interface might be so much better than it is at the moment

### Limitations

  * [AllDebrid][ad] in case of many failed logins shows a reCaptcha, and the Chrome App does not handle it currently, it only suggest to wait _several minutes_ before trying to log again.
  * It's not yet possible to upload `.torrent` files as on the standard website, not planned for now (as magnets are.. better?)

### Aim of the project
Create an user-made frontend interface to a proprietary service, so you can add functionalities without the need of altering the original website.  

# Start It Up
This should resemble a step-by-step guide to get this project up and running.

 * git clone repo
 * npm install

**development**:
 * run `gulp`
 * open your browser to the default `http://localhost:3000/`

**deploy**
 * copy `nginx-vars.sample.js` to `nginx-vars.js` and customize your hostname.
 * run `npm run deploy-ubuntu` or create another script for your current distro [and make a PR](https://github.com/colthreepv/alldebrid/pulls)

[ad]: https://www.alldebrid.com/

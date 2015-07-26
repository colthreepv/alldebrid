alldebrid~~-chrome~~
================

~~Alternative interface for [AllDebrid][ad] as a Chrome App.~~
I am moving away from Chrome App and creating a webapp that is self-hostable.
Requests to alldebrid gets done via a simple NGINX proxy ([configuration](config.nginx)).

### Known Issues

  * [AllDebrid][ad] in case of many failed logins shows a reCaptcha, and the Chrome App does not handle it currently, it only suggest to wait _several minutes_ before trying to log again.
  * It's not yet possible to upload `.torrent` files as on the standard website, not planned for now (as magnets are.. better?)

### Aim of the project
Create an user-made frontend interface to a proprietary service, so you can add functionalities without the need of altering the original website.  

[ad]: http://www.alldebrid.com/

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

### Configuration files

**test-account.json** - it's an Alldebrid fully working account to test login/logout

Example:
```json
{
  "username": "username",
  "password": "password"
}
```

**config.json** - various website configuration options

Example:
```json
{
  "domain": "yourhost.com"
}
```

## Promesso documentation

Promesso is a middleware adapter that converts a promise-based middleware to a standard Express middleware.

It supports annotations in the form of `@validation` or `@before`.

The promesso middleware can reply with:
*  a payload that gets sent to `res.send`
*  an Object like `{ method: 'redirect', args: ['/'] }` for custom `res[method]` calls
*  an Array for a sequence of `res[method]` calls

[ad]: http://www.alldebrid.com/

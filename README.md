alldebrid
================
Web application that uses [alldebrid.com][ad] as engine to provide data shown.
This branch is _heavily_ **Work In Progress**.

For a stable release check the [`legacy`][legacy] branch.

![GIF Demo](https://cloud.githubusercontent.com/assets/2657230/13898314/94325992-edcd-11e5-8c89-ec3b88a94ed4.gif)

### Known Issues

  * [AllDebrid][ad] in case of many failed logins shows a reCaptcha, and this corner case is not covered yet.
  * It's not yet possible to upload `.torrent` files as on the standard website, **planned**.

### Aim of the project
 - Made torrents a joke to use.
 - Is not required to install any torrent application on your device.

# Start It Up
This should resemble a step-by-step guide to get this project up and running.

 * git clone repo
 * npm install

**development**:
 * run `npm start`
 * open your browser to the default `http://localhost:8080/`

**deploy**
 * copy `nginx-vars.sample.js` to `nginx-vars.js` and customize your hostname.
 * run `npm run deploy-ubuntu` or create another script for your current distro [and make a PR](https://github.com/colthreepv/alldebrid/pulls)

**TODO**: complete revamp with Docker

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

[ad]: http://www.alldebrid.com/
[legacy]: https://github.com/colthreepv/alldebrid/tree/legacy

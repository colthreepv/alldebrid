const bundles = rootRequire('./config').bundles;

const page = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>AllDebrid Better Frontend</title>
  <meta name="description" content="">
  <link rel="shortcut icon" type="image/x-icon" href="//cdn.alldebrid.com/lib/images/default/favicon.png">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="${bundles.style}">
  <base href="/">
</head>
<body>
  <div id="container" ui-view></div>
  <script>window.opener.location.assign('/'); window.close();</script>
</body>
</html>`;

module.exports = page;

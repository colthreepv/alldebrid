// Recursively include files and convert paths to camelCase
var bulk = require('bulk-require');
exports = module.exports = bulk(__dirname, ['./!(index|_*|*.spec).js']);
Object.keys(exports).forEach(function (key) {
  var camelCased = key;
  camelCased = camelCased.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
  if (camelCased !== key) {
    exports[camelCased] = exports[key];
    delete exports[key];
  }
});

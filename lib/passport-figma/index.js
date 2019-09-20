const OAuth2Strategy = require('./strategy');

require('pkginfo')(module, 'version');

exports.Strategy = exports.OAuth2Strategy = OAuth2Strategy;
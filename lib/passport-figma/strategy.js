const util = require('util');
const OAuth2Strategy = require('passport-oauth2');
const InternalOAuthError = require('passport-oauth2').InternalOAuthError;

const Strategy = function(options, verify) {
    options = options || {};
    options.authorizationURL = options.authorizationURL || 'https://www.figma.com/oauth';
    options.tokenURL = options.tokenURL || 'https://www.figma.com/api/oauth/token';

    OAuth2Strategy.call(this, options, verify);
    this.name = "figma";

    this._oauth2.setAuthMethod("OAuth");
}

util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function(accessToken, done) {
    this._oauth2._request('GET','https://api.figma.com/v1/me', {'Authorization': 'Bearer ' + accessToken}, "", null, function (err, body, res) {
        if (err) {
            return done(new InternalOAuthError('User Profile could not be fetched', err));
        }

        try {
            const json = JSON.parse(body);

            const profile = {
                provider: 'figma',
                id: json.id,
                handle: json.handle,
                image_url: json.image_url,
                email: json.email,
                _raw: body,
                _json: json
            }

            done(null, profile);
        } catch(e) {
            done(e);
        }
    });
}

Strategy.prototype.authorizationParams = function(options) {
    return options;
}

module.exports = Strategy;
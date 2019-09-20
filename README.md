# passport-figma2
A passport strategy for Figma authentication.
Has support for profile information compared to [passport-figma]('https://github.com/LiamMartens/passport-figma')

### Install
```bash npm install passport-figma```

### Usage of OAuth 2.0

```javascript
var express        = require("express");
var session        = require('express-session');
var cookieParser   = require('cookie-parser');
var bodyParser     = require("body-parser");
var passport       = require("passport");
var FigmaStrategy = require('./lib/passport-figma').Strategy;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'hello',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new FigmaStrategy({
    clientID: '<CLIENT_ID>',
    clientSecret: '<CLIENT_SECRET>',
    callbackURL: "http://localhost:3000/auth/figma/callback",
    scope: "file_read",
    response_type: 'code'
  }, function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});
 
passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.get('/', (req, res) => {
    res.json(req.user);
});

app.get('/login', (req, res) => {
    res.json({message: 'You are not logged in!'})
})

app.get('/auth/figma', passport.authenticate('figma', {state: 'somestate'}));

app.get(
    '/auth/figma/callback', 
    passport.authenticate('figma', {failureRedirect: '/login'}), 
    (req, res) => {
        // Successful Request - Redirect home
        res.redirect('/');
    }
);

app.listen(3000);
```
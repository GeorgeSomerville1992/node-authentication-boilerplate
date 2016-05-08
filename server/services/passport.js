const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create Local stratey
// specfically tell 
const localOptions = {usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
  // verify this ussrname asnd password, call doen with user
  // other, call done with false
  // otherwise, call done with false...

  // assume it laready exists in db
  User.findOne({email:email}, function(err, user){
    if ( err ) { return done(err);}
    if ( !user ) { return done(null, false);}

    // compare passwords - is 'password ' equal to user.password..
    user.comparePassword(password, function(err, isMatch){
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false);}

      return done(null, user);
    });
  })
});

// Setup options for JWT Strategy,

// this will be extracted from authentication tokenForUser
console.log('secreeet', config.secret);
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};
console.log('gooo', jwtOptions);
// and we then pass it down into JwtStrategy

/*
 * param payload
 *
 */

 // some how it will look througe the entire request! 

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // payload
  // the payload from jwt.encode in autthenefication.js
  //see if user ID exists in database
    // call done with that 
  // other wise call done without a user object
  // they are not authenticated! 

  // do a find in user model with id.. simples..

  User.findById(payload.sub, function(err, user) {
    // we did not ifnd user id, return done
    if (err) { return done(err, false); }

    // we found one, loggin in...
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });

});
passport.use(jwtLogin);
passport.use(localLogin);
// Tell passport to use this strategy


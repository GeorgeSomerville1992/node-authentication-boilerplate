const jwt = require('jwt-simple');
const config = require('../config');
const User = require('../models/user');

function tokenForUser(user) {
  // SUBJECT OF THE TOKEN
  const timestamp = new Date().getTime();
  return jwt.encode({sub: user.id, iat: timestamp }, config.secret);
}


exports.signin = function(req, res, next) {
  // User has already has email and password auth'd
  // just need to give token;
  console.log('request request', req.user)
  res.send({token: tokenForUser(req.user)});
}

exports.signup = function(req, res, next) {
  console.log(req.body);
// 1) See if a user with a given email exists 
  const email = req.body.email;
  const password = req.body.password;


  if (!email || !password) {
    return res.status(422).send({error: 'valid email and password needed'})
  }

  // do like a query check or something...
  // mongo has callbacks which is cool
  // 2) If a user with email does exist, return an error 
  User.findOne({email: email}, function(err, existingUser) {
    // value will be null
    if (err) { return next(err);}
    // return 4222 http code, we couldn't find this 
    // call that we can manually set this
    if (existingUser) {
      return res.status(422).send({error: 'Email is in use'});
    }

    // 3) if a User with email DOES nOT exist, create and save record

    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err){
      if (err) {return next(err);}

      // 4) response to request indeicated user was created
      res.json({ token: tokenForUser(user) });
    });
  });

}

// 1) user signs up 
// 2) encrypt passport when stored
// 3) generate token when used 

// signin - exhcnage user name and password for token
// verify user is authenticated when they vist protected resource





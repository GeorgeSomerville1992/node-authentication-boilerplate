const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// define our model
// type as well
// need it to be unique!!!
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase:true},
  password: String
});

// On Save Hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next) {
  const user = this;
  // get access to model 
  // user is an INSTANCE of the user model

  // on per user save
  // use bcrypt to gen password
  // generate a salt
  bcrypt.genSalt(10, function(err, salt){
    // running bcrypt..
    if (err) { return next(err);}
    // hash/encrypt using the salt...
    bcrypt.hash(user.password, salt, null, function(err, hash){
      if(err) {return next(err);}

      //assing this hash to the user. 
      // just callbacks man.
      user.password = hash;
      next();
    })
  })
})

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {return callback(err);}

    callback(null, isMatch)
  });
}

// Create the model class 
// add model to schema...
const ModelClass = mongoose.model('user', userSchema);

// export the model

module.exports = ModelClass;

// 1) create schema
// 2) create model out of schema
// 3) export model.

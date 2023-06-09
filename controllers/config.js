const LocalStrategy = require('passport-local').Strategy;
const { getHashedPassword } = require('./function')
const { User } = require('../mongodb/model');

module.exports = {
    port: '3030', // http://localhost:3030 
    dbURI: 'mongodb+srv://mahnoor:noor378847@cluster0.lfbcan1.mongodb.net/?retryWrites=true&w=majority',
    function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            let hashed = getHashedPassword(password)
            User.findOne({email: email}).then(users => {
                if (!users) return done(null, false, {
                        message: 'That email is not registered',
                    })
                if (email === users.email && hashed === users.password) {
                    return done(null, users);
                } else {
                    return done(null, false, {
                        message: 'Invalid username or password',
                    })
                }
            })
        })
    )
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
    
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}}

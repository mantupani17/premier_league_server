/*
 * @Author : SudhiN
 * @Date : 23-DEC-2016
 * @Func :Config Passport Authentication 
 */

// load all the things we need
//var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var UserModel = require('./../models/User')

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function (username, password, done) {
        UserModel.authenticateUser(username).then(function (user) {
            if (!user) {
                return done(null, false, { message: 'Incorrect username/password.' });
            }

            if (user.status == 0 || user.status == false) {
                return done(null, false, { message: 'Your account is blocked,contact admin.' });
            }
            var isMatch = UserModel.validPassword(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect username/password.' });
            }
            return done(null, user, { message: 'Your login is successfull.' });
        }).catch(function (error) {
            return done(error);
        });

    }
));


////expose this function to our app using module.exports
module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        UserModel.getUserById(id, function (err, user) {
            done(err, user);
        });
    });
}; 

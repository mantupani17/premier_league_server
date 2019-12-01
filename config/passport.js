const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')

const UserModel = require('./../models/User')


module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField:'email'}, (email, password, done)=>{
            // match user
            UserModel.findOne({email:email})
            .then(user =>{
                if(!user){
                    return done(null, false ,{message:'email is not registered'});
                }

                // Match password
                if(password == user.password){
                    return done(null, user)
                }else{
                    return done(null, false, 'password incorrect')
                }   
            })
            .catch(err=> console.log(err))

        })
    );

    passport.serializeUser((user, done)=> {
        done(null, user.id);
    });
      
    passport.deserializeUser((id, done)=> {
        UserModel.findById(id, (err, user)=> {
            done(err, user);
        });
    });
}
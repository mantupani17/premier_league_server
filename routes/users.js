var express = require('express');
var router = express.Router();
const UserModel = require('../models/User')
const passport = require('passport')
// const initializePassport  = require('../config/passport-config')

const API = {}


// user login
API.login = function (req, res, next) {
   try {
        passport.authenticate('local', {
            successRedirect:'/dashboard',
            failureRedirect:'/login',
            failureFlash: true
        })(req, res, next);
    } catch (error) {
        console.log(error)
    }
};

// API.login = function()

API.resgistration = function(req, res , next){
    try {
        const userData = req.body
        const name = userData.name;
        const email = userData.email || 'mantu@mintbook.com '
        const password = userData.password || 'Infotech@1'
        const user = {
            name: name,
            email: email,
            password:password,
            setting: {
              themeColor: '',
              favouriteTeam:  '',
              teamIcon:''
            }
        }

        UserModel.createUser(user , function(err){
            if(err){
                console.log(err)
                res.send({status:false, 'message':'Failed'})
            }
            res.redirect('/login')
        })
        
    } catch (error) {
        console.log(error)
        res.redirect('/register')
        res.send({
            message : ""
        })
    }
}

router.post('/login',  API.login);

router.get('/logout', (req, res, next)=>{
    req.logout()
    res.redirect('/login')
})
router.post('/register', API.resgistration)
module.exports = router;
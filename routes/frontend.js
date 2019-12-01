var express = require('express');
var router = express.Router();
const API = {}
const {ensureAuthenticated} = require('../config/auth')

API.login = function(req, res){
    res.render('login.ejs',{title:'Login | Premier League'})
}

API.register = function(req, res){
    res.render('register.ejs',{title:'Register | Premier League'})
}
API.dashboard = function(req, res){
    res.render('dashboard.ejs',{title:'Dashboard | Premier League' , user:req.user.name})
}
API.portFolio = function(req, res){
    res.render('portfolio.ejs',{title:'Portfolio | Premier League' , user:req.user.name})
}




router.get('/login', API.login);
router.get('/register', API.register);
router.get('/dashboard', API.dashboard);
router.get('/port-folio', API.portFolio);
module.exports = router;
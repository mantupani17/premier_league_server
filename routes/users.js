var express = require('express');
var router = express.Router();

const API = {}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

API.userLogin = function (req, res, next) {
  var response = { status: 'FAILED' };
  //    var username = req.body.username; // Mobile Number or Email id
  var username = (typeof req.body.username !== "undefined") ? req.body.username.trim() : '';
  username = username.toLowerCase().replace(/ /g, "_");
  var candidatePassword = req.body.password;
  passport.authenticate('local', function (err, user, info) {
      if (err) {
          return next(err);
      }
      if (!user) {
          res.send({
              status: 'FAILED',
              redirectUrl: '/',
              data: user,
              msg: info.message
          });
          return;
      }
      //  var data = Math.random();
      // console.log(data);
      var drmId = crypto.randomBytes(10).toString('hex');
      // console.log(drmId);
      req.session.userId = user.id;
      req.session.drmId = drmId;
      req.session.roles = user.roles;
      req.session.userFullName = user.name;
      req.session.gender = user.gender;
      req.session.location = user.location;
      req.session.username = user.username;
      // console.log("Login Session -->", req.session);
      res.send({
          status: 'SUCCESS',
          redirectUrl: '/dashboard',
          data: user,
          msg: info.message
      });
  })(req, res, next);


};
router.post('/login', API.userLogin);
module.exports = router;

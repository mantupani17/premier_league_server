var createError = require('http-errors');
var express = require('express');
var helmet = require('helmet');
var compression = require('compression');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var path = require('path');
var cookieParser = require('cookie-parser');
var passport = require('passport');


var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var matchesRouter = require('./routes/match');
var frontRouter = require('./routes/frontend');

var app = express();
//For Security purpose
app.use(helmet());
app.use(compression())

require('./config/passport')(passport); // pass passport for configuration

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: 'PREMIER_LEAGUE_APP',
  resave: true,
  saveUninitialized: true,
  cookie: {
      path: '/',
      httpOnly: true,
      secure: false,
      maxAge: null
  },
  store: new MongoStore({
      url: 'mongodb://test_mantu:testmantu123@ds353457.mlab.com:53457/test_db',
      ttl: 14 * 24 * 60 * 60 // = 14 days. Default 
  })
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());



app.use(express.static(path.join(__dirname, 'public')));

app.use('/', frontRouter);
// var routes = require('./routes/index')(passport);
app.use('/api/users', usersRouter);
app.use('/api/match' ,matchesRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

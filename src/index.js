var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var db = require('./config/database');
var flash = require('express-flash');
var session = require('express-session');
var methodOverride = require('method-override');

const adminRoutes = require('./routes/admin');
const homeRoutes = require('./routes/home');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
  req.db = db;
  next();
})

app.use(session({
    secret: 'trashycle', 
    resave: false, 
    saveUninitialized: false,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: false 
    }
}));

app.use((req, res, next) => {
    if (req.session && req.session.userId) {
      res.locals.userId = req.session.userId;  // Store userId in res.locals
      res.locals.username = req.session.username;  // Store username in res.locals
    } else {
      res.locals.userId = null;  // If user is not authenticated, set userId to null
      res.locals.username = null;  // If user is not authenticated, set username to null
    }
    next();
  });

  app.use((req, res, next) => {
    console.log('Session data:', req.session);  // Log entire session to inspect if it's being set correctly
    next();
  });

app.use(flash());
app.use(methodOverride("_method"));

app.use(logger('dev'));
app.use(express.json()); // Untuk parsing request JSON
app.use(express.urlencoded({ extended: true })); // Untuk parsing form-data
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use('/home', homeRoutes); 

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});
  
app.use((req, res, next) => {
    console.log('Session saat ini:', req.session);
    next();
});
  
app.use(express.urlencoded({ extended: true }));

  
module.exports = app;
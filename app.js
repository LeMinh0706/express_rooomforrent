var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
let {CreateErrorRes} = require('./utils/responseHandler')
const cors = require('cors');

var indexRouter = require('./routes/index');


var app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));
mongoose.connect("mongodb://localhost:27017/rentroom");
mongoose.connection.on('connected',()=>{
  console.log("connected");
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/users'));
app.use('/role', require('./routes/roles'));
app.use('/room', require('./routes/roomType'));
app.use('/category', require('./routes/postCategory'));
app.use('/service', require('./routes/services'));
app.use('/post', require('./routes/post'));
app.use('/invoice', require('./routes/invoice'));
app.use('/review', require('./routes/reviews'));

app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  CreateErrorRes(res,err.message,err.status||500);
});

module.exports = app;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const {v4:uuidv4} = require('uuid')
var logger = require('morgan');
var hbs = require('express-handlebars');
var session = require('express-session')
const HandlebarsHelpers = require('./middleware/pagination'); // Adjust the path accordingly

//var fileUpload = require('express-fileupload')

var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var db = require('./Config/connection')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({extname:'hbs', defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/Partials/',
helpers: {
  isEqual: (status, value, options) => {
    if (status == value) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
    math: function (lvalue, operator, rvalue) {
      lvalue = parseFloat(lvalue);
      rvalue = parseFloat(rvalue);
      return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
      }[operator];
    }
  }
}
))

Object.keys(HandlebarsHelpers).forEach(helperName => {
  Handlebars.registerHelper(helperName, HandlebarsHelpers[helperName]);
});

// app.use('/', require('./routes/user')); // Adjust the path to your routes

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 600000000 }
}));
//app.use(fileUpload())
app.use(function (req, res, next) {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
)
next()
})

db.connect((err)=>{
  if(err) console.log('Connection error'+err);
  else console.log('Database connected to port 27017');
})

app.use('/admin', adminRouter);
app.use('/', userRouter);


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

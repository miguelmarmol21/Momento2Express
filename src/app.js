const path = require('path');
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

//Inicio
const app = express();
require('./database')
require('./passport/local-auth')

//Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); 


//Middlwares
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}))
app.use(session({
  secret:'mysecretKey',
  resave:false,
  saveUninitialized:false
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) =>{
  app.locals.errorMessage = req.flash('errorMessage');
  app.locals.error = req.flash('error');
  app.locals.car = req.flash('car');
  app.locals.rent = req.flash('rent');
  next();
})
  
//Routes
app.use('/', require('./routes/index'));


app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});

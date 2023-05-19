const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.serializeUser((user, done) =>{
    done(null, user.id);
});

passport.deserializeUser((id, done) =>{
   User.findById(id, (err,user)=>{
       done(null, user);
   });
});

// passport.use('local-register', new LocalStrategy({
//     usernameField:'user',
//     passwordField:'password',
//     passReqToCallback:true
// }, async (req, user, password, done)=>{
//     const findUser = await User.findOne({userName:user})
//     if(findUser){
//         return done(null, false, req.flash('errorMessage','El Usuario ya esta asociado a otra cuenta'));
//     }else if(findEmail){
//         return done(null, false, req.flash('errorMessage','El Correo Electronico ya esta asociado a otra cuenta'));
//     }else{
//         const newUsr = new User();
//         newUsr.names = req.param('names');
//         newUsr.lastnames = req.param('lastnames');
//         newUsr.userName = user;
//         newUsr.email = req.param('email');
//         newUsr.password = newUsr.encryptPassword(password);
//         await newUsr.save();
//         done(null, newUsr);
//     }
// }));

passport.use( new LocalStrategy({
    usernameField:'user',
    passwordField:'password',
    passReqToCallback:true
}, async (req, user, password, done)=>{
    const findUser = await User.findOne({userName:user})
    if(!findUser){
        return done(null, false, req.flash('errorMessage','Usuario no Existe'))
    }else{
        const match = await User.matchPassword(password)
        if(match){
           return done(null, findUser)
        }else{
            return done(null, false, req.flash('errorMessage','Contraseña Incorrecta'))
        }
    } 
    
}));
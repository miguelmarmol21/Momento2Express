const mongoose = require('mongoose');
const { mongodb } = require('./keys')

mongoose.connect(mongodb.URI,{useNewUrlParser:false}) 
  .then(db => console.log('Database MongoDB - Connected'))
  .catch(err => console.log(err));
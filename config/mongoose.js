const  mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/userdata_data');

const db = mongoose.connection;

db.on('error',console.error.bind(console,'error in connecting to db'));


db.once('open',function(){
    console.log('succesfully connected to the database');
})

 

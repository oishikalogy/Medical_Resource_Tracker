const express = require('express');
const path = require ('path');
const db = require('./config/mongoose');
const { User, Person } = require('./models/user');
const notifier = require('node-notifier');
const HospitalData = require('./models/hospital');

const port = 8080;

const app = express();
//const router = express.Router();

app.set('view engine','ejs');

app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded());

app.use(express.static('assets'));

app.get('/', function(req,res){
return res.render('sign_up', { 
})
});
app.get('/profile', function(req,res){
return res.render('profile',{
title:'This is chaitanya'
})
});

app.get('/sign_in', function(req,res){
return res.render('sign_in', { 
})
});
app.get('/home', function(req,res){
return res.render('home', { 
})
});

app.post('/create-user', async (req, res) => {
  try {
  const existingUser = await User.findOne({ email: req.body.YourEmail });
    if (existingUser) {
      // Display message to user that account already exists
      return res.render('sign_up', { message: 'An account with this email already exists' });
    }
    const newUser = await User.create({ email: req.body.YourEmail, password: req.body.password });
    console.log('User created:', newUser);
    await newUser.save();
    accountCreated();
  } catch (error) {
    console.error('Error creating User:', error);
    
    
  }
  return res.redirect('/sign_in');
});


app.post('/sign-in', async function(req, res) {
  try {
    const user = await User.findOne({email: req.body.YourEmail});
    if (user) {
      if (user.password != req.body.password) {
      loginfailed();
        return res.redirect('back');
      } else {
      accountloggedin();
        return res.redirect('/profile');
      }
    } 
  } catch (error) {
    console.log('Error fetching the user:', error);
    return res.redirect('back');
  }
});

app.post('/create-profile', async (req, res) => {

    try {
  
    const existingUser = await User.findOne({ email: req.body.YourEmail });
  
      if (existingUser) {
  
        // Display message to user that account already exists
        const existingPerson = await Person.findOne({name: req.body.YourName});
        //return res.render('/profile', { message: 'An account with this person already exists' });
        if(existingPerson){
  	return res.redirect('/profile');
        }
      	else{
      
      	const newPerson = await Person.create({ email: req.body.YourEmail,name:req.body.YourName,

        BloodGroup:req.body.BloodGroup,
    
        Height:req.body.height,
    
        Weight:req.body.weight,
    
        PhoneNumber:req.body.PhoneNo,
    
        Adress:req.body.YourAddress, });
  
      console.log('person created:', newPerson);
  
      await newPerson.save();
  
      accountCreated();
      }
    	return res.redirect('/home');
      
      }
  
  
    } catch (error) {
  
      console.error('Error creating person:', error);

    }
  
      	return res.redirect('/profile');
  });

/*app.get('/homepage', function (req, res) {
  HospitalData.find({place : "kolkata"})
    .then((hospitalData) => {
      if (hospitalData) {
      console.log(hospitalData)
        // Render the EJS template and pass the data as a variable
        res.render('homepage', { hospital_datas: hospitalData });
        //console.log(hospital_datas.rating);
      } else {
        console.log('No hospital data found');
        res.status(404).send('Not Result found');
      }
    })
    .catch((error) => {
      // Handle any errors that occurred during data retrieval
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});*/
app.get('/homepage', function (req, res) {
  HospitalData.find({ place: "kolkata" })
    .then((hospitalData) => {
      if (hospitalData && hospitalData.length > 0) {
        res.render('homepage', { hospital_datas: hospitalData });
      } else {
        console.log('No hospital data found');
        res.status(404).send('No Results Found');
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});

app.post('/search', function(req, res) {

    const location = req.body.location;
  
  
  
    HospitalData.find({ place: location })
  
      .then((hospitalData) => {
  
        if (hospitalData.length > 0) {
  
          res.render('homepage', { hospital_datas: hospitalData });
  
        } else {
  
          res.render('homepage', { hospital_datas: [], message: 'No results found' });
  
        }
  
      })
  
      .catch((error) => {
  
        console.error(error);
  
        res.status(500).send('Internal Server Error');
  
      });
  
  });
app.post('/resourcesearch', function(req, res) {
  const resource = req.body.resource;
  
  HospitalData.find({ feature: { $in: [resource] } })
  
    .then((hospitalData) => {
    console.log(hospitalData)
      if (hospitalData.length > 0) {
        res.render('homepage', { hospital_datas: hospitalData });
      } else {
        res.render('homepage', { hospital_datas: [], message: 'No results found' });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});

app.get('/hospital-details/:id', function(req, res) {
  const id = req.params.id;
  console.log(id);

  HospitalData.findById(id)
    .then((hospitalData) => {
      if (hospitalData) {
        console.log(hospitalData);
        res.render('hospital', { hospital_datas: hospitalData });
      } else {
        console.log("no data found");
        res.render('hospital', { hospital_datas: [], message: 'No results found' });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});

app.post('/sort', function(req, res) {
  const sortBy = req.body.sort; // Get the selected sort option from the request body
  let sortedHospitals = [];

  if (sortBy === 'rating') {
    // Sort hospitals by rating
    sortedHospitals = HospitalData.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'distance') {
    // Sort hospitals by distance
    sortedHospitals = HospitalData.sort((a, b) => a.distance - b.distance);
  } else if (sortBy === 'popularity') {
    // Sort hospitals by popularity
    sortedHospitals = HospitalData.sort((a, b) => b.popularity - a.popularity);
  }
  console.log(sortedHospitals);

  // Pass the sorted hospitals data to the template engine (assuming you're using one)
  res.render('homepage', { hospital_datas: sortedHospitals });
});
// Call this function when the account is created successfully
function accountCreated() {
  notifier.notify({
    title: 'Account Created',
    message: 'Your account has been created successfully!',
  });
}
function accountloggedin(){
	notifier.notify({
	title: 'logged in',
	message: 'Sucessfully logged in',
	});
}

function loginfailed(){
	notifier.notify({
	title: 'login Failed',
	message: 'Please Enter correct credentials',
	});
}
function personadded(){
	notifier.notify({
	title: 'Status',
	message: 'Person successfully added',
	});
}

//retreiving data from the database
app.get('/getdata', function(req, res) {
  User.find({},function(err,users){
  if(err){
  console.log('Error in fetching the Db');
  return;
  }
  return res.render('data',{
  user_data:users
  });
    });
});


app.listen(port,function(err){

if(err){

console.log('Error!!! Loading the page',err);

return;

}

console.log('Server is running on the port: ',port);

});

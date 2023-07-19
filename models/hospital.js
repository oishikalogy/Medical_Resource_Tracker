const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  place: String,
  hospital: String,
  rating: Number,
  phonenumber: String,
  address: String,
  feature: []
});

const HospitalData = mongoose.model('hospital_data', hospitalSchema);

module.exports = HospitalData;

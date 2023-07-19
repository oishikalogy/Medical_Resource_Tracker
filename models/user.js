const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
	email: { 
	type:String,
	required: true
	},
	name: { 
	type:String,
	required: true,
	unique: true
	},
	Weight: { 
	type:Number,
	required: true
	},
	Height: { 
	type:Number,
	required: true
	},
	BloodGroup: { 
	type:String,
	required: true
	},
	PhoneNumber: { 
	type:String,
	required: true
	},
	Adress: { 
	type:String,
	required: true
	},
});
//personSchema.index({name:1},{unique:true});
const Person = mongoose.model('Person',personSchema);

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    
}, {
    timestamps: true
});


const User = mongoose.model('User', userSchema);

module.exports = {User,Person};

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name:  String,
  email: String,
  password:   String,
  createdAt: { type: Date, default: Date.now },
  setting: {
    themeColor: String,
    favouriteTeam:  String,
    teamIcon:String
  },
  password:String
});


const User = module.exports =mongoose.model('users', UserSchema);


User.createUser = function(data, callback){
  return this.create(data , callback)
} 

User.authenticateUser = function(email, callback){
  return this.find({email:email} , callback)
}
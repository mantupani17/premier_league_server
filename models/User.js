var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name:  String,
  username: String,
  password:   String,
  createdAt: { type: Date, default: Date.now },
  setting: {
    themeColor: String,
    favouriteTeam:  String,
    teamIcon:String
  }
});


const User = mongoose.model('users', UserSchema);
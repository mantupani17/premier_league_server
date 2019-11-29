var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MatchSchema = new Schema({
    "id" : Number,
    "season" : Number,
    "city" : String,
    "date" : String,
    "team1" :String,
    "team2" :String,
    "toss_winner" :String,
    "toss_decision" : String,
    "result" : String,
    "dl_applied" : Number,
    "winner" : String,
    "win_by_runs" : Number,
    "win_by_wickets" : Number,
    "player_of_match" : String,
    "venue" : String,
    "umpire1" : String,
    "umpire2" :String,
    "umpire3" :String
});


var Match = module.exports = mongoose.model('matches', MatchSchema);
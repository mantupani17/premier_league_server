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

Match.createAllMatch = function(matches , callback){
    return this.create(matches , callback)
}

Match.getMatch = function(where, select, skip, limit , callback){
    where = where || {}
    select = select || null
    skip = skip || 0
    limit = limit || 10000
    return this.find( where , select, callback);
}

Match.getSeasons = function(where, callback){
    return this.aggregate([
        {$match:where},
        {$group:{"_id":"$season" ,teams: {$addToSet: "$team1"}} },
        {$project:{season:"$_id", noOfTeams:{$size:'$teams'}}}
    ])
    .exec(callback);
}

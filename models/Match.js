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


Match.getFuturePredictionByTeamWon =  function(team1, team2, callback){
    return this.aggregate([{$match:{$or:[
        {$and:[{"team1" :team1 } , {"team2" :team2}]},
        {$and:[{"team1" : team2} , {"team2" :team1}]}
        ]}},
        {
            $project: {
                toss_winner:1,
                toss_decision:1,
                result:1,
                winner:1,
                item: 1,
                firstTeamWon: {  
                    $cond: [ { $eq: [ "$winner", team1 ] }, 1, 0]
                },
                secondTeamWon: {  
                    $cond: [ { $eq: [ "$winner", team2 ] }, 1, 0]
                }
            }
        },
        {$group:{_id:"$winner" , firstTeamWon:{ $sum:"$firstTeamWon" } , secondTeamWon:{$sum:"$secondTeamWon"}}}
        ])
        .exec(callback);
}

Match.getFuturePredectionByVenue =  function(venue , team1, team2 , callback){
    return this.aggregate([
        {$match:{ "venue" : venue }},
        {$project: {
                    toss_winner:1, toss_decision:1, team1:1, team2:1,result:1,
                    winner:1, item: 1,venue:1,
                    totalMatchesFirstTeam:{
                        $cond: [ {$or:[{$eq:['$team1', team1]} , {$eq:['$team2', team1]}]}, 1, 0]
                    },
                    totalMatchesSecondTeam:{
                        $cond: [ { $or:[{$eq:['$team1', team2]} , {$eq:['$team2', team2]}]}, 1, 0]
                    },
                    firstTeamWon: {  
                        $cond: [ { $eq: [ "$winner", team1 ] }, 1, 0]
                    },
                    secondTeamWon: {  
                        $cond: [ { $eq: [ "$winner", team2 ] }, 1, 0]
                    }
                }
            },
            
            {$group:{_id:"$winner" , firstTeamTotMatch:{$sum:'$totalMatchesFirstTeam'}, secondTeamTotMatch:{$sum:'$totalMatchesSecondTeam'} ,firstTeamWon:{ $sum:"$firstTeamWon" } , secondTeamWon:{$sum:"$secondTeamWon"}}},
            {$project:{_id:1,firstTeamWon:1, secondTeamWon:1 , firstTeamTotMatch:1,secondTeamTotMatch:1}},
            {$match:{ $or:[{"_id": team1} , {"_id": team2 }] }}
        ]).exec(callback)
        
}

Match.getFuturePredectionByChosingBat =  function(team1, team2 , choose , callback){
    return this.aggregate([{$match:{ toss_decision:choose }},
    {
        $project: {
            toss_winner:1,
            toss_decision:1,
            team1:1,
            team2:1,
            result:1,
            winner:1,
            item: 1,
            venue:1,
            firstTeamWon: {  // Set to 1 if value < 10
                $cond: [ { $eq: [ "$winner", team1 ] }, 1, 0]
            },
            secondTeamWon: {  // Set to 1 if value > 10
                $cond: [ { $eq: [ "$winner", team2 ] }, 1, 0]
            }
        }
    },
    
    {$group:{_id:{ toss_winner : "$toss_winner" , toss_decision:"$toss_decision"} , winCount:{ $sum:"$firstTeamWon" } , lossCount:{$sum:"$secondTeamWon"}}},
    {$project:{_id:1,winCount:1, lossCount:1}},
    {$match:{ $or:[{"_id.toss_winner": team1} , {"_id.toss_winner": team2 }] }}
    ]).exec(callback)

} 
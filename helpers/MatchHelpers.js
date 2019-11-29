const MatchModel = require('./../models/Match')

const MatchHelpers = {
    listAllMatches() {
        MatchModel.find()
    }
}
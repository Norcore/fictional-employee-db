

const mongoose = require('mongoose');
const { Schema, model} = mongoose;

const BoardgameSchema = new Schema({
    name: String,
    maxPlayers: Number,
});

const BoardgameModel = model('Boardgame', BoardgameSchema);
module.exports = BoardgameModel;
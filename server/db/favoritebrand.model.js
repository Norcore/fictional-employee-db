const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const FavoriteBrandSchema = new Schema({
    name: String,
});

const FavoriteBrandModel = model('FavoriteBrand', FavoriteBrandSchema);

module.exports = FavoriteBrandModel;
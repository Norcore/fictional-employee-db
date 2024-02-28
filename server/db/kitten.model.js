

const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const KittenSchema = new Schema({
    name: String,
    weight: Number,
    employee: {type: Schema.Types.ObjectId, ref: 'Employee'},
});

const KittenModel = model('Kitten', KittenSchema);

module.exports = KittenModel;

const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const EquipmentSchema = new Schema({
    name: String,
    type: String,
    amount: Number
})

const Equipment = model('Equipment', EquipmentSchema);

module.exports = Equipment;
const mongoose = require("mongoose");
const Equipment = require("./equipment.model.js");

const { Schema, model } = mongoose;

const EmployeeSchema = new Schema({
  name: String,
  level: String,
  position: String,
  present: { type: Boolean, default: false },
  equipment: { type: Schema.Types.ObjectId, ref: 'Equipment' },
  favoriteBrand: { type: Schema.Types.ObjectId, ref: 'FavoriteBrand' },
  created: {
    type: Date,
    default: Date.now,
  },
  startingDate: String,
  currentSalary: String,
  desiredSalary: String,
  favoriteColor: String,
  kittens: [{ type: Schema.Types.ObjectId, ref: 'Kitten'}],
  address: {
    country: String,
    city: String,
    street: String,
    zipCode: Number,
  },
  division: {type: Schema.Types.ObjectId, ref: 'Division'},
  favGame: {type: Schema.Types.ObjectId, ref: "Boardgame"},
  tools: [{type: Schema.Types.ObjectId, ref: "Tools"}],
});

const Employee = model('Employee', EmployeeSchema);

module.exports = Employee;


const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const DivisionSchema = new Schema ({
    name: String,
    boss: {type: Schema.Types.ObjectId, ref: 'Employee'},
    budget: Number,
    location: {
        country: String,
        city: String,
    },
});

const DivisionModel = model('Division', DivisionSchema);
module.exports = DivisionModel;
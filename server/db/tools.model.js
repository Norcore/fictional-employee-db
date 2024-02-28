

const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ToolsSchema = new Schema({
    name: String,
    weight: Number,
});

const ToolsModel = model('Tools', ToolsSchema);

module.exports = ToolsModel;
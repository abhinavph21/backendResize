const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
    data: String,
    id: Number
});

const Data = mongoose.model('Data', dataSchema);
module.exports = { Data }
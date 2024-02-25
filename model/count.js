const mongoose = require('mongoose')

const countSchema = new mongoose.Schema({
    id: Number,
    count: Number,
});

const Count = mongoose.model('Count', countSchema);
module.exports = { Count }
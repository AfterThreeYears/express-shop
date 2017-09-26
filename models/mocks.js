const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mockSchema = new Schema({
    path: String,
    jsonStr: String,
});

module.exports = mongoose.model('Mock', mockSchema, 'mocks');
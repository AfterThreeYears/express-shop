const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mockSchema = new Schema({
    path: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    jsonStr: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Mock', mockSchema, 'mocks');
const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    data: Date,
    total: String,
    dateCrawled: Date
});

let User = mongoose.model('User', userSchema);

module.exports = User;
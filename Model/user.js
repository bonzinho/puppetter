const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    data: String,
    total: String,
    dateCrawled: Date
});

let User = mongoose.model('User', userSchema);

module.exports = User;
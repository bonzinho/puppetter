const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    username: Date,
    email: String,
    dateCrawled: Date
});

let User = mongoose.model('User', userSchema);

module.exports = User;
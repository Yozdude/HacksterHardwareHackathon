var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var MessageSchema = new Schema({
	user: String,
	lng: Number,
	lat: Number,
	msg: String
});

module.exports = mongoose.model('Message', MessageSchema);
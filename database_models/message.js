var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var MessageSchema = new Schema({
	user: String,
	lng: Number,
	lat: Number,
	text: String,
	time: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);
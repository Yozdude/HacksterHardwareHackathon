var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var PreferencesSchema = new Schema({
	userSignupAllowed: { type: Boolean, default: true },
});

module.exports = mongoose.model('Preferences', PreferencesSchema);
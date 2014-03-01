var Mongoose = require("mongoose"), Schema = Mongoose.Schema;

var userSchema = new Schema({
    name: String,
    password: String,
    email: String,
    head: String
}, {
    collection: 'users'
});
Mongoose.model('User', userSchema);



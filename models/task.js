var Mongoose = require("mongoose"),
    Schema = Mongoose.Schema;

var taskSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    stat: Number,
    kinds: [{type: Schema.Types.ObjectId, ref: 'Kind'}],
    content: String,
    time: {}
}, {
    collection: 'tasks'
});



Mongoose.model('Task', taskSchema);

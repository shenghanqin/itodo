var Mongoose = require("mongoose"),
    Schema = Mongoose.Schema;

var kindSchema = new Schema({
    name: String,
    point: Number,
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    time: []
}, {
    collection: 'kinds'
});

Mongoose.model('Kind', kindSchema);





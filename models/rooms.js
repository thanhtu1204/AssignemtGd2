var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var RoomSchema = new Schema({
    room_number: { type: String, unique: true, required: true, dropDups: true },
    floor: { type: Number, default: 0 },
    hotel_id: { type: Schema.Types.ObjectId, ref: ('hotels') },
    single_room: {
    type: Boolean, default: true},
    price: { type: Number, default: 0 },
    status: { type: Number, default: 1 },
    image: { type: String, default: null },
    detail: { type: String, default: null }
});

module.exports = mongoose.model('rooms', RoomSchema);
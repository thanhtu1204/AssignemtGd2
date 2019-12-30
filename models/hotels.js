var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HotelSchema = new Schema({
  name:  {type: String, unique : true, required : true, dropDups: true},
  city: {type: String, default: null},
  address: {type: String, default: null},
  owner: {type: String, default: null},
  license_number: {type: Number, default: 0},
  total_floor: {type: Number, default: 0},
  image: {type: String, default: null}
});


module.exports = mongoose.model('hotels', HotelSchema);
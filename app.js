var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// using mongoose js
var mongoose = require('mongoose');
let dev_db_url = 'mongodb://localhost:27017/PT13352_FN';

let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {useNewUrlParser: true, useCreateIndex: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//===============HBS help s=================
var hbs = require('hbs');
hbs.registerHelper('check_room_status', (selectedData = -1) => {
  var content = `<select name="room_status" class="form-control">`
  content += `<option value="1"`
  if(selectedData == 1){
    content += ` selected `;
  }
  content+= `>is Emty</option>`;

  content += `<option value="2"`
  if(selectedData == 2){
    content += ` selected `;
  }
  content+= `>Have Put</option>`;

  content += `<option value="3"`
  if(selectedData == 3){
    content += ` selected `;
  }
  content+= `>Not use</option>`;
  content += `</select>`;

  return content;
})
hbs.registerHelper('single_room',(selectedData=false)=>{
var content =`<select name="single_room" class="form-control">`
content +=`<option value="true"`
if(selectedData==true){
  content +=`selected`;
}
content += `>Yes</option>`;
content +=`<option value="false"`
if(selectedData==false){
  content +=`selected`;
}
content += `>No</option>`;
content += `</select>`
return content;
})



//'''''''''''''''''''''''view HBS///////////
var hbs = require('hbs');
hbs.registerHelper('View_room_status', (selectedData = -1) => {
  var content = `<select name="room_status" class="form-control">`
  content += `<option disabled value="1"`
  if(selectedData == 1){
    content += ` selected `;
  }
  content+= `>is Emty</option>`;

  content += `<option disabled value="2"`
  if(selectedData == 2){
    content += ` selected `;
  }
  content+= `>Have Put</option>`;

  content += `<option disabled value="3"`
  if(selectedData == 3){
    content += ` selected `;
  }
  content+= `>Not use</option>`;
  content += `</select>`;

  return content;
})
//view index sttt//////////////////
hbs.registerHelper('View_single_room',(selectedData=false)=>{
  var content =`<select  name="single_room" class="form-control">`
  content +=`<option disabled value="true"`
  if(selectedData==true){
    content +=`selected`;
  }
  content += `>Yes</option>`;
  content +=`<option disabled value="false"`
  if(selectedData==false){
    content +=`selected`;
  }
  content += `>No</option>`;
  content += `</select>`
  return content;
  })


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

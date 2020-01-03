var express = require('express');
var router = express.Router();
var multer = require('multer');
var shortid=require('shortid');
var hotels = require('../models/hotels');
var rooms = require('../models/rooms');
var storage = multer.diskStorage({
    //nơi lưu trữ
    destination: function (req, file, cb) {
      cb(null, './public/uploads');

    }, filename: function (req, file, cb) {
      cb(null, shortid.generate() + "00" + file.originalname);
    }

  });
  var upload = multer({ storage: storage });

  /* GET home page. */
  router.get('/', function (req, res, next) {
    hotels.find({})
            .populate('cate_id')
            .exec((err, data) => {
              console.log(data);
              res.render('hotels/index', { ht: data });
            });
  });
  router.get('/hotels/add', function (req, res, next) {
    res.render('hotels/add-hotels');
  });
  router.post('/hotels/add-new', upload.single('image'), function (req, res, next) {
    // tạo model
     var models=new hotels();
     //gán giá trị cho model
     models.name=req.body.name;
     models.image=req.file.path.replace('public','');
     models.city=req.body.city;
     models.address=req.body.address;
     models.owner=req.body.owner;
     models.total_floor=req.body.total_floor;
     models.license_number=req.body.license_number;
     //lưu
     models.save(function(err){
       if(err){
         res.send(' save error');
       }
       res.redirect('/');
     })
    });
    router.get('/hotels/Remove/:hId', function (req, res, next) {
      hotels.deleteOne({ _id: req.params.hId }, function (err) {
        if (err) return handleError(err);
        res.redirect('/');
      });
    });

    router.get('/hotels/edit/:hId', function(req, res, next){

      var hId = req.params.hId;

      hotels.findOne({_id: hId}, function(err, data){
        if(err){
          res.send('id khong ton tai');
        }

        res.render('hotels/edit-hotels', {ht: data});
      });
    });

    router.post('/hotels/save-edit', upload.single('image'), function(req, res, next){

      // neu khong upload anh => req.file == null
      let {id, name, city,address,owner,total_floor,license_number} = req.body;
      hotels.findOne({_id: id}, function(err, model){
        if(err){
          res.send('Id khong ton tai');
        }

        model.name = name;
        model.city = city;
        model.address=address;
        model.owner=owner;
        model.total_floor=total_floor;
        model.license_number=license_number;
        if(req.file != null){
          model.image = req.file.path.replace('public', '');
        }
        model.save(function(err){
          if(err){
            res.send('cap nhat khong thanh cong');
          }

          res.redirect('/');
        })
      })

    });

//=================Room==================
router.get('/rooms', function (req, res, next) {
  rooms.find({})
          .populate('hotel_id')
          .exec((err, data) => {
            console.log(data);
            res.render('rooms/index', { ro: data });
          });
});

//==================add rooms=====
router.get('/room/add', function (req, res, next) {
  hotels.find({}, (err, data) => {
    console.log(data);
    res.render('rooms/add-room', {room: data});
  })
});
router.post('/room/add-new', upload.single('image'), (req, res, next) => {
  var model = new rooms();
  model.room_number = req.body.room_number;
  model.floor = req.body.floor;
  model.hotel_id = req.body.hotel_id;
  model.single_room= req.body.single_room;
  model.price=req.body.price;
  model.status= req.body.status;
  model.detail = req.body.detail;
  model.image = req.file.path.replace('public', '');
  console.log(model);
  model.save((err) => {
    if(err){
      res.send('Luu khong thanh cong');
    }

    res.redirect('/rooms');
  })
});
//===xóa======

router.get('/room/Remove/:rId', function (req, res, next) {
  rooms.deleteOne({ _id: req.params.rId }, function (err) {
    if (err) return handleError(err);
    res.redirect('/rooms');
  });
});

//===edit=========
router.get('/room/edit/:rId', function(req, res, next){
  hotels.find({}, (err, data) => {

    rooms.findOne({_id: req.params.rId}, (err, roomData)=> {
      if(err){
        res.send('id san pham khong ton tai');
      }

      for(var i = 0; i < data.lengnth; i++){
        if(data[i]._id == roomData.hotel_id.toString()){
          data[i].selected = true;
        }
      }
      res.render('rooms/edit-room', {hotel: data,room : roomData});
    });
  })
});

//=======lấy dữ liệu từ from=============
router.post('/room/save-edit', upload.single('image'), function(req, res, next){

      // neu khong upload anh => req.file == null
      let {id, room_number, floor,hotel_id,single_room,price,status,detail} = req.body;
      rooms.findOne({_id: id}, function(err, model){
        if(err){
          res.send('Id khong ton tai');
        }

        model.room_number = room_number;
        model.floor = floor;
        model.hotel_id=hotel_id;
        model.single_room=single_room;
        model.price=price;
        model.status=status;
        model.detail=detail;
        if(req.file != null){
          model.image = req.file.path.replace('public', '');
        }
        model.save(function(err){
          if(err){
            res.send('cap nhat khong thanh cong');
          }

          res.redirect('/rooms');
        })
      })

    });
//===========save edit=============================

router.post('/room/save-edit', upload.single('image'), function(req, res, next){
  rooms.findOne({_id: req.body.id}, function(err, model){
    if(err){
      res.redirect('back');
    }

    model.room_number = reg.body.room_number;
    model.floor = reg.body.floor;
    model.hotel_id=reg.body.hotel_id;
    model.single_room=reg.body.single_room;
    model.price=reg.body.price;
    model.status=reg.body.status;
    model.detail=reg.body.detail;
    if(req.file != null){
      model.image = req.file.path.replace('public', '');
    }

    model.save(function(err){
      if(err){
        res.send('Luu khong thanh cong');
      }

      res.redirect('/rooms');
    })
  })
});
router.get('/api/hotels',(req,res)=>{
  hotels.find({},(err,data)=>{
res.json({success:true,hotels:data})
  })
});

router.get('/api/rooms',(req,res)=>{
  rooms.find({},(err,data)=>{
    res.json({success:true,rooms:data})
  })

});
  module.exports = router;

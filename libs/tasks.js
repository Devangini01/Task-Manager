'use strict';
//save user api
const express = require("express");
let task = require('./models/tasks-model');
let ensureAuthenticated = require('./auth');
let jwt = require('jwt-simple');
let config = require('../config');
let moment = require('moment');
let app = express();

app.post('/api/saveTask', function(req, res) {
  let param = new task({
    taskBy : req.body.taskBy,
    fromDateTime :  new Date(req.body.fromDateTime),
    toDateTime : new Date(req.body.toDateTime),
    task : req.body.task,
  });
  if(req.body.taskBy!= ""){
    param.taskBy = req.body.taskBy
  }
  param.save(function (err,data){
    if(err){
      res.jsonp({success: false,data:'Save failed:',err});
      res.end();
    }
    if(data){
      res.jsonp({success:true,data:data});
      res.end();
    }
  });
});

app.get('/api/getTasks/:taskBy', ensureAuthenticated, function(req, res) {
  task.find({'taskBy':req.params.taskBy})
  .populate('taskBy')
  .exec(function(err,result){
    if(err){
      res.jsonp({ success:false,data:err});
      res.end();
    }
    if(result){
      res.jsonp({ success:true,data:result});
      res.end();
    }else{
      //This means data not found
      res.jsonp({ success:false, msg:"Unable to find data"});
      res.end();
    }
  });
});

app.get('/api/getAllTasks/', ensureAuthenticated, function(req, res) {
  task.find({})
  .populate('taskBy')
  .exec(function(err,result){
    if(err){
      res.jsonp({ success:false,data:err});
      res.end();
    }
    if(result){
      res.jsonp({ success:true,data:result});
      res.end();
    }else{
      //This means data not found
      res.jsonp({ success:false, msg: "Unable to find data"});
      res.end();
    }
  });
});


app.delete('/api/deleteTask/:id', ensureAuthenticated, function(req,res){
  task.findByIdAndRemove({_id:req.params.id}, function (err,result){
    if(err){
      res.jsonp({
        success: false,
        data:err
      });
      res.end();
    }
    if(result){
      res.jsonp({
        success: true,
        data:'saved'
      });
      res.end();
    }
  });
})

app.post('/api/getTaskByUser', function(req, res) {
  let obj = {};
  if(req.body.taskBy){
    obj.taskBy = req.body.taskBy;
  }
  if(req.body.fromDateTime && req.body.toDateTime ){
    obj.fromDateTime ={  $gte: new Date(req.body.fromDateTime)  };
    obj.toDateTime ={  $lte: new Date(req.body.toDateTime).setHours(23, 59, 59) }
  }
  task.find(obj)
  .populate('taskBy')
  .exec(function(err,result){
    if(err){
      res.jsonp({ success:false,data:err});
      res.end();
    }
    if(result){
      res.jsonp({ success:true,data:result});
      res.end();
    }else{
      //This means data not found
      res.jsonp({ success:false, msg: "Unable to find data"});
      res.end();
    }
  });
});

app.get('/api/getTotalHours', /*ensureAuthenticated,*/ function(req, res) {
  
  task.aggregate([
//       { $addFields: { $time:{} } }
      { $group: { _id: null, time: { $sum: "$time" }   } },
  ])
  .exec(function(err,result){
    console.log(result);
    if(err){
      res.jsonp({ success:false,data:err});
      res.end();
    }
    if(result){
      res.jsonp({ success:true,data:result});
      res.end();
    }else{
      console.log('not found');
      //This means data not found
      res.jsonp({ success:false, msg: "Unable to find data"});
      res.end();
    }
  });
});




module.exports = app ;

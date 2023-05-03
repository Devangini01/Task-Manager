'use strict';
const express = require("express");
let addTask = require('./models/addTasks-model');
let ensureAuthenticated = require('./auth');
let jwt = require('jwt-simple');
let config = require('../config');
let moment = require('moment');
let app = express();


app.post('/api/saveAddTask', ensureAuthenticated, function(req, res) {
  let param = new addTask({
    task : req.body.task,
  });
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

app.get('/api/getAllAddTasks/', ensureAuthenticated, function(req, res) {
  addTask.find({})
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

app.delete('/api/deleteAddTask/:id', ensureAuthenticated, function(req,res){
  addTask.findByIdAndRemove({_id:req.params.id}, function (err,result){
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

module.exports = app ;

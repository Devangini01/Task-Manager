'use strict';
//save user api
const express = require("express");
let mongoose = require('mongoose');
let accounts = require('./models/accounts-model');
let ensureAuthenticated = require('./auth');
let bodyParser = require("body-parser");
let jwt = require('jwt-simple');
let config = require('../config');
let moment = require('moment');
let app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false,limit: '50mb' }));

app.set("jsonp callback", true);

app.post('/api/saveAccount', function(req, res) {
  
  req.body.isActive = req.body.isActive == "" ? false : req.body.isActive ;
	let param = new accounts({name:req.body.name , contact_no:req.body.contact_no, isActive: req.body.isActive});
          param.save().then(function(data){
            res.jsonp({success:true,data:data});
            res.end();
          },function(err){
            res.jsonp({success:false,data:'Save failed: ',err});
            res.end();
          })
 });

app.put('/api/updateAccount', ensureAuthenticated, function(req, res) {
  accounts.findById(req.body.id,function(error,result){
     if (error) {
       res.jsonp(error);
       res.end();
    }
    
    result.name=req.body.name;
    result.contact_no=req.body.contact_no;
    result.isActive=req.body.isActive;
    result.save(function (err, data){
      if(err){
       res.jsonp({
          success: false,
          data: 'Update failed',err
        });
        res.end();
      }
      res.jsonp({
          success: true,
          data:'saved'
      });

    });
  })
});



app.delete('/api/deleteAccounts/:id',ensureAuthenticated, function(req,res){
  accounts.findByIdAndRemove({_id:req.params.id}, function (err,result){
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

app.get('/api/getAccounts',function(req, res) {
       accounts.find({}, function(err,result){
             if(err){
               res.jsonp({ success:false,data:err});
               res.end();
             }
             if(result){
               res.jsonp({ success:true,data:result});
               res.end();

             }else{
               //This means data not found
               res.jsonp({ success:false,data:'data not found'});
               res.end();
             }
         })
      // res.jsonp({
      //   success: true,
      //   message: ['saved']
      // });
      // res.end();
});

app.get('/api/getAccountData',ensureAuthenticated, function(req, res) {
       accounts.find({isActive: true }).sort({name: 1}).exec(function(err,result){
             if(err){
               res.jsonp({ success:false,data:err});
               res.end();
             }
             if(result){
               res.jsonp({ success:true,data:result});
               res.end();

             }else{
               //This means data not found
               res.jsonp({ success:false,data:'data not found'});
               res.end();
             }
         })
});

app.get('/api/getSingleAccount/:id', ensureAuthenticated, function(req, res) {
  accounts.findOne({_id:req.params.id},function (err, result){
    if (err){
      res.jsonp({
        success: false,
        data:err
      });
      res.end();
      }
    if(result){
      res.jsonp({
          success: true,
          data:[{
            id: result._id,
            partyName: result.name ,
            contact: result.contact_no,
            isActive: result.isActive
          }],
      });
      res.end()
    }
  });
});
    
  
app.get('/api/accountSearch/:name',ensureAuthenticated, function(req, res) {
  accounts.find({name :{$regex:/ekta/i}}, function(err,result){
    if(err){
      res.jsonp({ success:false,data:err});
      res.end();
    }
    if(result){
      res.jsonp({ success:true,data:'found'});
      res.end();
    }else{
      //This means data not found
      res.jsonp({ success:false,data:'data not found'});
      res.end();
    }
  })
});

module.exports = app ;

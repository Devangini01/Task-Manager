'use strict';
//save user api
const express = require("express");
let transaction = require('./models/transaction-model');
let ensureAuthenticated = require('./auth');
let jwt = require('jwt-simple');
let config = require('../config');
let moment = require('moment');
let app = express();
let openBalance=0;
app.post('/api/savePayment', function(req, res) {
  console.log("SAve");
    let param = new transaction({
      transactionBy : req.body.transactionBy,
      paymentType :req.body.paymentType,
      date : req.body.date,
      name : req.body.name,
      narration :req.body.narration,
      account: req.body.account,
      amount : req.body.amount,
      denomination:{
        rs2000:req.body.denomination.rs2000,
        rs500:req.body.denomination.rs500,
        rs200:req.body.denomination.rs200,
        rs100:req.body.denomination.rs100,
        rs50:req.body.denomination.rs50,
        rs20:req.body.denomination.rs20,
        rs10:req.body.denomination.rs10,
        coins:req.body.denomination.coins,
      }
    });

    if(req.body.account != ""){
      param.account = req.body.account
    }
    if(req.body.account==null || req.body.account==""){
      param.account=null;
    }
    

    param.save(function (err,data){
      if(err){
        res.jsonp({success: false,data:'Save failed:',err});
        res.end();
      }
      if(data){
        console.log("success");
        res.jsonp({success:true,data:data});
        res.end();
      }
    });

});

app.put('/api/updatePayment/:id', ensureAuthenticated, function(req, res) {
  transaction.findById(req.body.id,function(error,result){
    if (error) {
      res.jsonp(error);
      res.end();
    }
    result.date=req.body.date;
    result.account=req.body.account;
    result.name=req.body.name;
    result.amount=req.body.amount;
    result.paymentType=req.body.paymentType;
    result.narration=req.body.narration;
    result.transactionBy=req.body.transactionBy;
    result.denomination=req.body.denomination;
    result.save(function (err, data){
      if(err){
        res.jsonp(err);
        res.end();
      }
      res.jsonp({
          success: true,
          data:'saved'

      });
    });
  })
});

app.post('/api/saveReceipt', function(req, res) {
    let param = new transaction({
      transactionBy : req.body.transactionBy,
      paymentType :req.body.paymentType,
      date : req.body.date,
      name : req.body.name,
      narration :req.body.narration,
      account: req.body.account,
      amount : req.body.amount,
      denomination:{
        rs2000:req.body.denomination.rs2000,
        rs500:req.body.denomination.rs500,
        rs200:req.body.denomination.rs200,
        rs100:req.body.denomination.rs100,
        rs50:req.body.denomination.rs50,
        rs20:req.body.denomination.rs20,
        rs10:req.body.denomination.rs10,
        coins:req.body.denomination.coins,
      }
    });

    if(req.body.account != ""){
      param.account = req.body.account
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


app.put('/api/updateReceipt/:id', ensureAuthenticated, function(req, res) {
  transaction.findById(req.body.id,function(error,result){
    if (error) {
      res.jsonp(error);
      res.end();
    }
    result.date=req.body.date;
    result.account=req.body.account;
    result.name=req.body.name;
    result.amount=req.body.amount;
    result.paymentType=req.body.paymentType;
    result.narration=req.body.narration;
    result.transactionBy=req.body.transactionBy;
    result.denomination=req.body.denomination;
    result.save(function (err, data){
      if(err){
        res.jsonp(err);
        res.end();
      }
      res.jsonp({
          success: true,
          data:'saved'
      });
    });
  })
});

app.delete('/api/deleteReceipt/:id',ensureAuthenticated, function(req,res){
  transaction.findByIdAndRemove({_id:req.params.id}, function (err,result){
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

app.get('/api/getSingleReceipt/:id', ensureAuthenticated, function(req, res) {
  transaction.findOne({_id:req.params.id})
  //.select('_id name accounts')
  .populate('account')
  .exec(function (err, result){
    if (err){
      res.jsonp({
        success: false,
        data:err
      });
      res.end();
      }
    if(result){
      if(result.account){
        result.account = result.account._id ;
      }
      res.jsonp({
          success: true,
          data:result,
      });
      res.end()
    }
  });
});


app.delete('/api/deleteTransaction/:id', ensureAuthenticated,function(req,res){
  transaction.findByIdAndRemove({_id:req.params.id}, function (err,result){
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

app.get('/api/getTransaction/:date', ensureAuthenticated, function(req, res) {
  transaction.find({
  'isApproved':true,
  'date': new Date(req.params.date),
  })
  .populate('account')
  .populate('transactionBy')
  .exec(function(err,result){
    if(err){
      res.jsonp({ success:false,data:err});
      res.end();
    }
    if(result.length){
      res.jsonp({ success:true,data:result});
      res.end();
    }else{
      //This means data not found
      res.jsonp({ success:false,data:[], msg: "Unable to find data"});
      res.end();
    }
  });
});

app.get('/api/getTransactionByAccount/:id', ensureAuthenticated, function(req, res) {
  transaction.find({
  'isApproved':true,
  'account':req.params.id,
  })
  .populate('account')
  .populate('transactionBy')
  .exec(function(err,result){
    if(err){
      res.jsonp({ success:false,data:err});
      res.end();
    }
    if(result.length){
      res.jsonp({ success:true,data:result});
      res.end();
    }else{
      //This means data not found
      res.jsonp({ success:false,data:[], msg: "Unable to find data"});
      res.end();
    }
  });
});


app.get('/api/getSingleTransaction/:id', ensureAuthenticated, function(req, res) {
  transaction.findOne({_id:req.params.id})
  .exec(function (err, result){
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
          data:result,
      });
      res.end()
    }
  });
});


app.get('/api/getUnapprovedTransaction', function(req, res) {
  transaction.find({'isApproved':false})
  .populate('account')
  .populate('transactionBy')
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
      res.jsonp({ success:false,msg:'No records available'});
      res.end();
    }
  });
});




app.put('/api/approveTransaction', ensureAuthenticated, function(req, res) {
  transaction.findById(req.body.id, function (error, result) {
    if (error) {
        res.jsonp(error);
        res.end();
      }
    result.isApproved=true;
    result.save(function (err,data) {
      if (err) {
        res.jsonp({
          success: false,
          msg: 'Approve failed',err
        });
        res.end();
      }
      if (data){
        res.jsonp({
        success: true,
        data:'saved'
      });
      res.end();
      }
      
    });
  });
});

app.get('/api/getSinglePayment/:id',ensureAuthenticated ,function(req, res) {
  transaction.findOne({_id:req.params.id})
  //.select('_id name accounts')
  .populate('account')
  .exec(function (err, result){
    if (err){
      res.jsonp({
        success: false,
        data:err
      });
      res.end();
    }
    if(result){
      if(result.account){
        result.account = result.account._id ;
    }
    res.jsonp({
        success: true,
        data:result,
    });
    res.end()
    }
  });
});

app.get('/api/getTransactionByDate/:date', ensureAuthenticated, function(req, res) {
  transaction.find({date: date(req.params.date)})
  .populate('account')
  .populate('transactionBy')
  .exec(function (err, result){
    if (err){
      res.jsonp({ success: false, data:err });
      res.end();
    }
    if(result){
      res.jsonp({ success: true, data:result, });
      res.end()
    }else{
      res.jsonp({ success: true, data: [] , 'msg': 'No record found'});
      res.end()
    }
  });
});

app.get('/api/getOpenBalance/:date', ensureAuthenticated, function(req, res) {
  transaction.aggregate([
  {
    $facet: {
      "payment":[
       //{ $project: { payment:{ $ifNull: ["$payment",0]} } },
        { $match : { $and : [ {isApproved: true}, { paymentType: 'payment' },{date: {$lt: new Date(req.params.date)}}] } },
        { $group: { _id: null, payment: { $sum: "$amount" }   } },
      ],
      "receipt":[
       //{ $project: { receipt:{ $ifNull: ["$receipt",0] } } },
        { $match : { $and : [ {isApproved: true}, { paymentType: 'receipt' },{date: {$lt: new Date(req.params.date)}}] } },
        { $group: { _id: null, receipt: { $sum: "$amount" }  } },
      ]
    }
  }
])
  .exec(function (err, result){
    if (err){
      res.jsonp({
        success: false,
        err :err
      });
      res.end();
      }
      
    if(result){
      let payment = 0 ; let receipt = 0 ;
      if(result[0].payment && result[0].payment.length && result[0].payment[0].hasOwnProperty('payment')){
        payment = result[0].payment[0].payment ;
      }
      if(result[0].receipt && result[0].receipt.length && result[0].receipt[0].hasOwnProperty('receipt') ){

        receipt = result[0].receipt[0].receipt;
      }
      if((result[0].payment[0] != null) || (result[0].receipt[0]!= null)){
        console.log(result);
        openBalance= receipt - payment;
        console.log(openBalance);
        res.jsonp({
            success: true,
            data:result,
            balance: openBalance,
        });
        res.end()
      }else{
        openBalance=0;
          res.jsonp({
            success: true,
            data:result,
            balance: openBalance,
        });
      }
    }
  });
});

 
module.exports = app ;

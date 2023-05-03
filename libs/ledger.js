'use strict';
//save user api
const express = require("express");
let users = require('./models/ledger-model');
let ensureAuthenticated = require('./auth');
let jwt = require('jwt-simple');
let config = require('../config');
let moment = require('moment');
let app = express();

app.route('/api/saveLedger')
.post(function(req, res) {
  res.jsonp({
            success: false,
            message: "User name already exists."
    });
    res.end();
 });

app.put('/api/updateLedger', ensureAuthenticated, function(req, res) {
  res.jsonp({success: true,data:'saved'});
  res.end();
})

app.route('/api/getLedgers')
.get(/*ensureAuthenticated,*/ function(req,res){
 
    res.jsonp({success: true,data:'saved1'});
    res.end();
})

app.route('/api/deleteLedger')
.post(/*ensureAuthenticated,*/ function(req,res){
    res.jsonp({success: true,data:'saved'});
    res.end();
})

module.exports = app ;
'use strict';
//save user api
const express = require("express");
let users = require('./models/attendance-model');
let ensureAuthenticated = require('./auth');
let jwt = require('jwt-simple');
let config = require('../config');
let moment = require('moment');
let app = express();

app.route('/api/saveAttendance')
.post(function(req, res) {
  res.jsonp({
            success: false,
            message: "User name already exists."
    });
    res.end();
 });

app.put('/api/updateAttendance', ensureAuthenticated, function(req, res) {
  
  res.jsonp({success: true,data:'saved'});
  res.end();
})

app.route('/api/getAttendance')
.get(/*ensureAuthenticated,*/ function(req,res){
  
    res.jsonp({success: true,data:'saved1'});
    res.end();
})

app.route('/api/deleteAttendance')
.post(/*ensureAuthenticated,*/ function(req,res){
  
    res.jsonp({success: true,data:'saved'});
    res.end();
})

module.exports = app ;
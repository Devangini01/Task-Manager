'use strict';
let allSchema = require('./schemas');
let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
let Schema = mongoose.Schema ;

// 	Schema for Account collection
let AttendanceSchema = new Schema(allSchema.AttendanceSchema);
AttendanceSchema.plugin(mongoosePaginate);
let attendance = mongoose.model('attendance', AttendanceSchema);

module.exports = attendance;
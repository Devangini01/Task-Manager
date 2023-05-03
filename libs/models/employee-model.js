'use strict';
let allSchema = require('./schemas');
let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
let Schema = mongoose.Schema ;

// 	Schema for Account collection
let EmployeeSchema = new Schema(allSchema.EmployeeSchema);
EmployeeSchema.plugin(mongoosePaginate);
let employee = mongoose.model('Employee', EmployeeSchema);

module.exports = employee;
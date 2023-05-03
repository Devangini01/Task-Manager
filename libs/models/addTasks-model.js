'use strict';
let allSchema = require('./schemas');
let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
let Schema = mongoose.Schema ;

// 	Schema for Account collection
let AddTaskSchema = new Schema(allSchema.AddTaskSchema);
AddTaskSchema.plugin(mongoosePaginate);
let addTask = mongoose.model('addTask', AddTaskSchema );

module.exports = addTask;

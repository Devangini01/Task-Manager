'use strict';
let allSchema = require('./schemas');
let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
let Schema = mongoose.Schema ;

// 	Schema for Account collection
let TaskSchema = new Schema(allSchema.TaskSchema,
  {
    toObject: {
      virtuals: true
    },
    toJSON: {
    virtuals: true 
    }
  });
TaskSchema.plugin(mongoosePaginate);

TaskSchema.virtual('time').get(function () {
  return (Math. abs(this.toDateTime - this.fromDateTime) / 36e5)*60;
});



let task = mongoose.model('task', TaskSchema);
module.exports = task;

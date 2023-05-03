'use strict';
let allSchema = require('./schemas');
let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
let Schema = mongoose.Schema ;

// 	Schema for Account collection
let PaymentSchema = new Schema(allSchema.PaymentSchema);
PaymentSchema.plugin(mongoosePaginate);
let payments = mongoose.model('Payment', PaymentSchema);

module.exports = payments;
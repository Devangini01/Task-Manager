'use strict';
let allSchema = require('./schemas');
let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
let Schema = mongoose.Schema ;

// 	Schema for Account collection
let TransactionSchema = new Schema(allSchema.TransactionSchema);
TransactionSchema.plugin(mongoosePaginate);
let transaction = mongoose.model('transaction', TransactionSchema);

module.exports = transaction;

'use strict';
let allSchema = require('./schemas');
let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
let Schema = mongoose.Schema ;

// 	Schema for Account collection
let LedgerSchema = new Schema(allSchema.LedgerSchema);
LedgerSchema.plugin(mongoosePaginate);
let ledger = mongoose.model('Ledger', LedgerSchema);

module.exports = ledger;
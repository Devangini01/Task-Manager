'use strict';
let allSchema = require('./schemas');
let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
let Schema = mongoose.Schema ;

// 	Schema for Account collection
let AccountSchema = new Schema(allSchema.AccountSchema,                               {
                                 toObject: {
    virtuals: true
  },
  toJSON: {
  virtuals: true 
    }
  }
);
AccountSchema.plugin(mongoosePaginate);
AccountSchema.virtual('partyName')
.get(function(){
// 	console.log(this.userId);
		return this.name ;

})

let accounts = mongoose.model('accounts', AccountSchema,'accounts');
module.exports = accounts;

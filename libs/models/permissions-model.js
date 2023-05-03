'use strict';
let allSchema = require('./schemas');
let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
let Schema = mongoose.Schema ;

// 	Schema for Account collection
let PermissionSchema = new Schema(allSchema.PermissionSchema);
PermissionSchema.plugin(mongoosePaginate);
let permissions = mongoose.model('Permission', PermissionSchema);

module.exports = permissions;
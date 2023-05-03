'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema ;

let allSchema = {

  UserSchema : {
    firstname: { type: String, required: [true, 'firstname required'] },
    lastname: { type: String, required: [true, 'lastname required']  },
    mobile:{ type: String, required: [true, 'mobile required']  },
    address: { type: String, required: [true, 'addressrequired']  },
    username: {type: String , required: [true, 'username required'] , unique: true, lowercase: true},
    email: { type: String,  lowercase: true, required: [true, 'email required']  },
    password: { type: String, select: false, required: [true, 'password required']  },
    isAdmin: { type: String,
               enum: ['owner','manager','staff'], 
               default: 'staff', 
               required: [true,'permission required']
    },
    isActive: Boolean,
  },

  AccountSchema : {
   name:{ type: String, required: [true, 'account name required']},
   contact_no: {type: String},
   isActive:{ type: Boolean, default: true } ,
  },

  TransactionSchema : {
    transactionBy:{ type: Schema.Types.ObjectId, ref: 'users' , required: [true, 'transaction by required']},
    paymentType :{ type: String, enum: ['payment', 'receipt'],
      required: [true, 'transaction type required']
    },
    account : { type: Schema.Types.ObjectId, ref: 'accounts'},
    date : { type : Date, required: [true, 'transaction date required']},
    name : { type : String },
    narration : { type : String },
    amount : { type : Number , required: [true, 'transaction amount required'] },
    isApproved : { type : Boolean, default : false },
    approvedOn : { type : Date },
    denomination : {
      rs2000 : { type : Number , default : 0},
      rs500 : { type : Number , default : 0},
      rs200 : { type : Number , default : 0},
      rs100 : { type : Number , default : 0},
      rs50 : { type : Number , default : 0},
      rs20 : { type : Number , default : 0},
      rs10 : { type : Number , default : 0},
      coins : { type : Number , default : 0},
    },
  },
  
  TaskSchema : {
    taskBy:{ type: Schema.Types.ObjectId, ref: 'users' , required: [true, 'task by required']},
    fromDateTime : { type : Date, required: [true, 'From Time date required']},
    toDateTime:{ type : Date},
    task:{ type:String, required:[true,'Task required']},
  },
  
  AddTaskSchema : {
    task : { type: String ,required:[true,'Task required']},
  }
  
}
module.exports = allSchema ;

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

'use strict';
//save user api
const express = require("express");
let users = require('./models/users-model');
let transaction = require('./models/transaction-model');
let task = require('./models/tasks-model');
let ensureAuthenticated = require('./auth');
let jwt = require('jwt-simple');
let config = require('../config');
let moment = require('moment');
let app = express();
//const { roles } = require('../roles');
/*
|--------------------------------------------------------------------------
| Generate JSON Web Token
|--------------------------------------------------------------------------
*/
let createJWT = function (user) {
  let payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
}

var handleError = function(error) {
    console.log(error);
    return false ;
};


app.post('/api/saveUser', /*ensureAuthenticated,*/ function(req, res) {
    //Checking if username is already present in system
    users.findOne({ username: req.body.username }, '+password -documents')
      .exec(function (err,user){
        if (!user){ /// This means user is not present need to save it
           var lastRecId = 1;
           let user = new users({
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              address: req.body.address,
              username: req.body.username,
              mobile: req.body.mobile,
              password: req.body.password,
              email: req.body.email,
              isAdmin: 'owner', // If you are sure its first entry then make it "Yes"
              isActive: true ,
          });
          user.save(req.body.password,function(err, result) {
            if (err) {
              res.status(500).send({success:false, message: err.message });
              res.end();
            }else{
              if(result != undefined){
                res.jsonp({ success:true,data:result,token: createJWT(result) });
                res.end();
              }else{
                res.jsonp({ success:false, message:'Unable to save data' });
                res.end();
              }
            }
          });
        }else{
          res.jsonp({
            success: false,
            message: "User name already exists."
          });
          res.end();
        }
      });


});



//change password  api
app.put('/api/changePassword:id',ensureAuthenticated, function(req, res) {
  users.findById(req.body.id,function (err, user) {
    if (error){
      res.jsonp(error);
      res.end();
    } 
    user.password = req.body.password ;
    user.save(function (err,tank) {
      if (err){
        res.jsonp({success: false,msg:err});
        res.end();
      }if(tank){
        res.jsonp({success: true,data:tank});
        res.end();
      }
    });
  });
});

app.put('/api/updatePermission',ensureAuthenticated, function(req, res) {
  if(!req.body.data){
    console.log("Not found");
    return;
  }
  console.log(req.body);
  Promise.all(

    req.body.data.map(async (obj) => {
      await users.findOneAndUpdate({_id:obj._id }, {$set: {isAdmin: obj.isAdmin}});
    })
  ).then(function (data) {
         res.jsonp({
          success: true,
          data:'User updated with permission'
        });
        res.end();
      });
    });


app.get('/api/getUsers', ensureAuthenticated, function(req, res) {
       users.find({}, function(err,result){
             if(err){
               res.jsonp({ success:false,data:err});
               res.end();
             }
             if(result){
               res.jsonp({ success:true,data:result});
               res.end();

             }else{
               //This means data not found
               res.jsonp({ success:false,data:'data not found'});
               res.end();
             }
         })
      // res.jsonp({
      //   success: true,
      //   message: ['saved']
      // });
      // res.end();
});


//login Api
app.route('/api/login')
  .post(function(req, res) {
    //console.log('api is accessed',req.body);
      users.findOne({ username: req.body.username, isActive: true }, '+password')
      //.populate('type')
      .exec( function(err, user) {
      if (!user) {
        //return res.status(401).send({ message: 'Invalid email and/or password' });
            res.jsonp({
              success: false,
              message: "User not found in system"
            });
            res.end();
      }else{
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (!isMatch) {
              //return res.status(401).send({ message: 'Invalid email and/or password' });
              res.jsonp({
                  success: false,
                  message: "Invalid username and/or password"
                });
                res.end();
            }else{
              //console.log(user);
                /*
                users.findOneAndUpdate({id: user.id},{}, {upsert:true}, function(err,data){
                  if(err) {
                    console.log(err);
                  }
                })
                */
                res.jsonp({
                  success: true,
                  token: createJWT(user),
                  data:user
                });
                res.end();
            }
        });
      }
    });
});

  
  
  
app.delete('/api/deleteUser/:id'/*, ensureAuthenticated*/, function(req,res){
  task.deleteMany({ taskBy: req.params.id },function(err,data){
					console.log('tasks User removed');
  })
  transaction.deleteMany({ transactionBy: req.params.id },function(err,data){
					console.log('transaction User removed');
  })
  users.findByIdAndRemove({_id:req.params.id}, function (err,result){
    if(err){
      res.jsonp({
        success: false,
        data:err
      });
      res.end();
    }
    if(result){
      res.jsonp({
        success: true,
        data:'saved'
      });
       res.end();
    }
  });
})


app.put('/api/updateUser/:id', ensureAuthenticated, function(req, res) {
  users.findById(req.params.id,function(error,result){
    if (error) {
      res.jsonp(error);
      res.end();
    }
    result.firstname=req.body.firstname;
    result.lastname=req.body.lastname;
    result.address=req.body.address;
    result.mobile=req.body.mobile;
    result.email=req.body.email;
    result.narration=req.body.narration;
    result.username=req.body.username;
    result.isActive = req.body.isActive;
    result.save(function (err, data){
      if(err){
        res.jsonp({
          success: false,
          data: 'Update failed',err
        });
        res.end();
      }

      if(data){
        res.jsonp({
          success: true,
          data:'saved'
        });
      }
    });
  })
});
app.get('/api/404', function(req, res,next) {
   res.status(404);

   //throw new Error('oh no!');

});

app.get('/api/getSingleUser/:id', ensureAuthenticated, function(req, res) {
  users.findOne({_id:req.params.id})
  .exec(function (err, result){
    if (err){
      res.jsonp({
        success: false,
        data:err
      });
      res.end();
      }
    if(result){
      res.jsonp({
          success: true,
          data:result,
      });
      res.end()
    }
  });
});


app.route('/api/getUserData')
.get(function(req, res) {
       users.find({isActive: true},' _id firstname', function(err,result){
             if(err){
               res.jsonp({ success:false,data:err});
               res.end();
             }
             if(result){
               res.jsonp({ success:true,data:result});
               res.end();

             }else{
               //This means data not found
               res.jsonp({ success:false,data:'data not found'});
               res.end();
             }
         })
});

module.exports = app ;

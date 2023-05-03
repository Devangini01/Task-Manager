'use strict';

const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const mongoose = require('mongoose');
const cors = require('cors');
const ObjectId = require("mongodb").ObjectID;
const path = require('path');
const CONNECTION_URL = "mongodb://127.0.0.1:27017/account";
//const CONNECTION_URL = "mongodb://myuser:root@127.0.0.1:27017/account"
//const DATABASE_NAME = "account";

const users = require('./libs/users');
const accounts = require('./libs/accounts');
const payments = require('./libs/transaction');
const ledger = require('./libs/ledger');
const task = require('./libs/tasks');
const attendance = require('./libs/attendance');
const employee = require('./libs/employee');
const addTask = require('./libs/addTasks')
//const permission = require('./libs/permissions');

var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
var database, collection;

app.use("/api/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  return next();
});


app.use(Express.static(path.join(__dirname, 'dist/accounts')));
app.use('/login', Express.static(path.join(__dirname, 'dist/accounts/index.html')));
app.use('/dashboard', Express.static(path.join(__dirname, 'dist/accounts/index.html')));
app.use('/party', Express.static(path.join(__dirname, 'dist/accounts/index.html')));
app.use('/ledger', Express.static(path.join(__dirname, 'dist/accounts/index.html')));
app.use('/forgot', Express.static(path.join(__dirname, 'dist/accounts/index.html')));
app.use('/receipts', Express.static(path.join(__dirname, 'dist/accounts/index.html')));
app.use('/payment', Express.static(path.join(__dirname, 'dist/accounts/index.html')));
app.use('/employees', Express.static(path.join(__dirname, 'dist/accounts/index.html')));
app.use('/registration', Express.static(path.join(__dirname, 'dist/accounts/index.html')));
app.use('/task-status', Express.static(path.join(__dirname, 'dist/accounts/index.html')));
app.use('/attendance', Express.static(path.join(__dirname, 'dist/accounts/index.html')));
app.use('/partyledger/*', Express.static(path.join(__dirname, 'dist/accounts/index.html')));
app.use('/task', Express.static(path.join(__dirname, 'dist/accounts/index.html')));
app.use('/', Express.static(path.join(__dirname, 'dist/accounts')));



app.use(cors());

app.use(users);
app.use(accounts);
app.use(payments);
app.use(ledger);
app.use(task);
app.use(attendance);
app.use(employee);
app.use(addTask);
//app.use(permission);

app.set("jsonp callback", true);
app.set('view engine', 'ejs');

 mongoose.Promise = global.Promise; // To avoid deprecation
 mongoose.connect(CONNECTION_URL, {
 // useMongoClient: true
  useNewUrlParser: true ,
  useUnifiedTopology: true
}).then({},
   function (error) {

    if (error) {
        console.log('Error:' , error);
    }
 });
mongoose.set('useCreateIndex', true);

const Schema = mongoose.Schema;

// when status is 404, error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    if( 404 === err.status  ){
        res.format({
            'text/plain': () => {
                res.send({message: 'not found Data'});
            },
            'text/html': () => {
                res.send({message: '404 not found'});
                //res.render('404.ejs');
            },
            'application/json': () => {
                res.send({message: 'not found Data'});
            },
            'default': () => {
                res.status(406).send('Not Acceptable');
            }
        })
    }

    // when status is 500, error handler
    if(500 === err.status) {
        return res.send({message: 'error occur'});
    }
});


app.listen(process.env.PORT || 9001, () => {

    app.listen();
	console.log('Server started on ' + (process.env.PORT || 9001) );
});

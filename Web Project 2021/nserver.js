const express = require('express');
const cookie = require('cookie-parser');
const bodyParser = require('body-parser');
var session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt');
var mysql = require('mysql');
const flash = require('connect-flash');
const { resolveSoa } = require('dns');
const { check, validationResult } = require('express-validator');
const http = require('http');
const { callbackify } = require('util');
const { resolve } = require('path');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const router = express.Router();


var db = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'Nickos1997',
	database : 'har_db'
});

db.connect(function(err) {
    if(err) {
        throw err
    }
    console.log("database connected!!!");
});

app=express();
app.use( express.static('public') );
app.use(bodyParser.urlencoded({limit:"120mb", extended: true }))
app.use(bodyParser.json({limit:"120mb"}));
app.set('view-engine','ejs')
app.use(session({
	secret: 'secret',
	resave: false,
    saveUninitialized: false
    
}));



app.use('/',require('./routes/login'));
app.use('/',require('./routes/register'));
app.use('/',require('./routes/upload'));
app.use('/',require('./routes/home'));
app.use('/',require('./routes/updateus'));
app.use('/',require('./routes/updatepass'));
app.use('/',require('./routes/Owner'));
app.use('/',require('./routes/Info'));
app.use('/',require('./routes/chart1'));
app.use('/',require('./routes/chart2'));
app.use('/',require('./routes/chart3'));
app.use('/',require('./routes/chart4'));
app.use('/',require('./routes/updateacc'));

app.get('/', (req,res)=> {
    console.log("hello")
    if(!session.loggedin)
        res.render('index.ejs')
    else
        res.redirect('/home')
})

app.get('/about',(req,res)=>{
    res.render('about.ejs')
  })



app.get('/progress', (req,res)=>{
    res.render('progressbar.ejs')
})


app.listen(3000,'192.168.1.10',(err)=>{
    if(err) throw err;
    else console.log("Server started!!!")
})

const express = require('express');
var mysql = require('mysql');
const router = express.Router();
var session = require('express-session');
var moment = require('moment')
const db = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'Nickos1997',
	database : 'har_db'
});


router.get('/updateacc', (req,res)=> {
  if(session.loggedin)
    if(!session.role) {
    var sql = "select max(rdate) as rdate from har_file where us_id=?"
    var sql1 = "select count(*) as count from har_file where us_id=?"
    db.query(sql,[session.uid],function(error,results){
        db.query(sql1,[session.uid],function(error,results1){
            console.log(results)
            lup = (results[0].rdate)
            amt = results1[0].count
            
           
            res.render("updateacc.ejs",{lastup: moment(lup).format('ddd MM/DD/YYYY hh:mm A'), amount:amt})
        })
        
    })
    
   }else res.render("adminacc.ejs")
  else
    res.render("login.ejs",{perror: session.error})


})


module.exports=router;
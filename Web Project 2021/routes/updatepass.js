const express = require('express');
var mysql = require('mysql');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const session = require('express-session');
const db = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'Nickos1997',
	database : 'har_db'
});

router.get('/updatepass', (req,res)=>{
    res.render('updatepass.ejs', {perror: session.perror, p1error: session.p1error, p2error: session.p2error})
})

router.post('/updatepass',check('newpassword').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),  (req,res)=>{
 const errors1 = validationResult(req)
    session.perror = false;
    session.p1error = false;
    session.p2error = false;

     var username = req.body.username;
     var oldpass = req.body.oldpassword;
     var newpass = req.body.newpassword;
     var repnewpass = req.body.repnewpassword;

      
     var sql1="SELECT * from users where username=? AND password=?"
      
     
     db.query(sql1,[username,oldpass],function(err,results){
           if(err) {
             throw err;
           }
           if(results.length > 0) {
            usid = results[0].user_id
            oldpassword = results[0].password
            us = results[0].username
             if(usid == session.uid) {
           
               if(errors1.isEmpty() && newpass == repnewpass) {
               
                
                var sql="UPDATE users SET password=? where user_id=?";
                db.query(sql,[newpass,usid],function(err,results){
                   if(err){
                     throw err;
                   }
                   res.redirect('/home');
                   console.log("password updated")
                     })
               
               
                }
                 else {
                  session.p1error = true;
                  res.redirect('/updatepass')
                 }
                
            }
             else {
                   session.perror = true;
                   res.redirect('/updatepass')
                  }
          
         } 
            else {
                   session.p2error = true;
                   res.redirect('/updatepass')
                 }
         
          
       })
})
module.exports = router;
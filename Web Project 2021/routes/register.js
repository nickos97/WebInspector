const express = require('express');
var mysql = require('mysql');
const router = express.Router();
var session = require('express-session');
var bcrypt = require('bcrypt')
const { check, validationResult } = require('express-validator');

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
});

app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
}));


router.get("/register",(req,res)=>{
    res.render("register.ejs",{rerror:session.rerror})
})

router.post('/register', [
    check('password')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ ,)
  ] ,(req,res)=>{

    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var repass = req.body.rep_password;
    const errors = validationResult(req)    

    if(errors.isEmpty() && repass==password) {
        db.query("select username from users where username=?",[username],function(error,results){
            if(results.length>0){
                session.rerror=true; 
                res.redirect('/register');
            }
        
            else {
            var sql="INSERT INTO users (email, username, password, role) VALUES (?,?,?,?)";
            bcrypt.hash(password,10,(err, hash)=> {
                db.query(sql,[email,username,hash,0],function(error, results){
                    if(error) {
                        throw error;  
                    }
                    console.log("1 record inserted");
                    res.redirect('/login');
                    })
            });
            }
        })
            
    }
    else {
        
        res.redirect("/register");
    }
    })


module.exports=router;

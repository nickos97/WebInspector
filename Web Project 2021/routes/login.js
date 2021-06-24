const express = require('express');
var mysql = require('mysql');
const router = express.Router();
var session = require('express-session');
var bcrypt = require('bcrypt')
var flash = require('connect-flash');
const { render } = require('ejs');

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


router.get("/login",(req,res)=>{
    if(session.loggedin)
        res.redirect("/home")
    else
        res.render("login.ejs",{perror: session.error})
})

router.post('/login',(req,res)=>{
    let username=req.body.username;
    var password=req.body.password;
    session.username=username;
    //session.ip=req.body.ipdata.ip
    var sql="SELECT * from users WHERE username=?";
        db.query(sql,[username],function(err,results){

            if(err) throw err;

            if(results.length>0){
                bcrypt.compare(password, results[0].password, (err,response) => {
                    if(response){
                        
                        session.error=0;
                        session.uid = results[0].user_id;
                        session.loggedin=true;
                        
                        if(!results[0].role)
                            res.redirect("/home");
                        else {
                            session.posted=false;
                            res.redirect("/Owner")
                        }
                    }
                    else {
                        session.error=1
                        res.redirect('/login') 
                    }
                    })
            }
            else {
                session.error=2
                res.redirect('/login');
            }
        })
    
        
})



module.exports=router;


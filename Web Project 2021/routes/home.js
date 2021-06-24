var mysql = require('mysql');
const fs=require("fs");
var session = require('express-session');
const express = require('express');
geoip=require("geoip-lite")
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
});

app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
}));

app.get('/home',(req,res)=>{
    session.error=0
    session.rerror=false;
    session.upsuccess=false;
    //console.log(session.upsuccess)
    if(session.loggedin && !session.role){
        geo=[]
    db.query("select serveripaddress from entries where h_id in (select har_id from har_file where us_id in (select user_id from users where user_id=?))",[session.uid],(err,results)=>{
        db.query("select content_type from res_headers where reshead_id in (select res_id from responses where res_id in (select ent_id from entries where h_id in (select har_id from har_file where us_id in (select user_id from users where user_id=?))))",[session.uid],(err,hresults)=>{
            k=0;
            if(results.length>0){
        
            for(var i in results) {
                if(results[i].serveripaddress!=null && hresults[i].content_type!=null && hresults[i].content_type.includes("html")){
                    ip=results[i].serveripaddress.replace("[","").replace("]","")
                    if(geoip.lookup(ip)!=null){
                    geo[k]={lat:geoip.lookup(ip).ll[0],lng:geoip.lookup(ip).ll[1],count:0}
                        k++
                    }
                }
            }
                len=geo.length;
        for (var j in geo){
            geo[j].count=10/len
          
        }
    passed=[]
    
    for (var i in geo){
        occur=0
        pass=false
        
        for (var j in geo){
            if(JSON.stringify(geo[i])==JSON.stringify(geo[j])){
                occur++
            }
        }
        passed[i]=geo[i]
        
        if(occur*10/len<1)
            geo[i].count=1/occur;
        
    }
    console.log(geo)
}
   
    sgeo=JSON.stringify(geo)
    res.render("home.ejs",{cords: sgeo})
}) 
})       
    }
    else if(session.loggedin && session.role) {
        res.redirect("/Owner")
        
    }
    else
        res.render("login.ejs",{perror: session.error})
})

router.post("/home",(req,res)=>{
    
    console.log("signout pressed")
    session.loggedin=false;
    session.role=0
    
})

module.exports=router;
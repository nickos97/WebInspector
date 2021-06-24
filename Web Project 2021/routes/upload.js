var mysql = require('mysql');
const fs=require("fs");
var session = require('express-session');
const express = require('express');
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

app.get('/upload', (req,res)=>{
    if(session.loggedin){
    res.render('upload.ejs',{upsuccess:session.upsuccess})
    }
    else
        res.redirect('/home')
})

router.post("/upload", (req,res)=>{
    //console.log(req.body.idata)
    ip=req.body.data.idata.ip_address
    city=req.body.data.idata.city
    lat=req.body.data.idata.latitude
    long=req.body.data.idata.longitude
    isp=req.body.data.idata.connection.isp_name
    console.log(long)
    console.log(lat)
    let har=req.body.data.hdata;
    let id=session.uid;
    let data=JSON.parse(har);
    let hid;
    let eid;
    entries=[]
    time=[]
    resp=[]
    req=[]
    hresp=[]
    hreq=[]
    var sql="INSERT INTO har_file (us_id,ip,city,isp,longitude,latitude) VALUES (?,?,?,?,?,?)";
    db.query(sql,[id,ip,city,isp,long,lat],function(err){
        if(err) {session.upsuccess=false;throw err;}
        db.query("SELECT har_id FROM har_file ORDER BY har_id DESC LIMIT 1; ",function(err,results){
          if(err) {session.upsuccess=false;throw err;}
          hid=results[0].har_id
    for (var i in data){
          entries[i]=[hid,data[i].startedDateTime,data[i].serverIPAddress]
          
    }
    console.log(entries)
    db.query("INSERT INTO entries (h_id,starteddatetime,serveripaddress) VALUES ?",[entries],function(err){
      if(err) {session.upsuccess=false;throw err;}
      db.query("select ent_id from entries ORDER BY ent_id DESC LIMIT ?,?;",[data.length-1,1],function(err,results){
          if(err) {session.upsuccess=false;throw err;}
          eid=results[0].ent_id;
          for (var i in data) {

            if(data[i].response.headers[1].value){
            if(data[i].response.headers[1].value.length>80)
                data[i].response.headers[1].value=null
            }
              time[i]=[eid,data[i].timings.wait]
              resp[i]=[eid,data[i].response.status,data[i].response.statusText]
              req[i]=[eid,data[i].request.method,data[i].request.url,isp]
              if(data[i].response.headers[0].value){
                hresp[i]=[eid,data[i].response.headers[0].value.split(';')[0],data[i].response.headers[1].value,data[i].response.headers[2].value,data[i].response.headers[3].value,data[i].response.headers[4].value,data[i].response.headers[5].value,data[i].response.headers[6].value]
              }
              else
                hresp[i]=[eid,data[i].response.headers[0].value,data[i].response.headers[1].value,data[i].response.headers[2].value,data[i].response.headers[3].value,data[i].response.headers[4].value,data[i].response.headers[5].value,data[i].response.headers[6].value]
              hreq[i]=[eid,null,data[i].request.headers[1].value,data[i].request.headers[2].value,data[i].request.headers[3].value,data[i].request.headers[4].value,data[i].request.headers[5].value,data[i].request.headers[6].value]
              eid++
          }
          
          db.query("INSERT INTO timings (timings_id,wait) VALUES ?",[time],function(err){
              if(err) {session.upsuccess=false;throw err;}  
          })
          db.query("INSERT INTO requests (req_id,method,url,isp) VALUES ?",[req],function(err){
              if(err) {session.upsuccess=false;throw err;}
          })
          db.query("INSERT INTO responses (res_id,status,status_text) VALUES ?",[resp],function(err){
              if(err) {session.upsuccess=false;throw err;}
          })
          db.query("INSERT INTO res_headers (reshead_id,content_type,cache_control,pragma,expires,age,host,last_modified) VALUES ?",[hresp],function(err){
              if(err) {session.upsuccess=false;throw err;}
          })
          db.query("INSERT INTO req_headers (reqhead_id,content_type,cache_control,pragma,expires,age,host,last_modified) VALUES ?",[hreq],function(err){
              if(err) {session.upsuccess=false;throw err;}
              session.upsuccess=true
                //console.log(session.upsuccess)
                console.log("pressed")
                
              
          })
  
  })
  })
  })
    })

    
  })





module.exports = router;



const express = require('express');
var mysql = require('mysql');
const router = express.Router();
var session = require('express-session');
const bodyParser = require('body-parser');
// Load the full build.

// Load the core build.




const db = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'Nickos1997',
	database : 'har_db'
});
db.connect(function(err) {
    if(err) {
        throw err;
    } 
});

router.get('/chart3', (req,res)=>{
    if(session.loggedin) {
        db.query("Select distinct(content_type) from res_headers",function(error,results) {
            db.query("Select distinct(isp) from requests", function(error,results1){
                console.log(results1)
            
            c1=[]
            for(var i=0; i<results.length; i++) {
                if(results[i].content_type!=null)
                    c1.push(results[i].content_type)
            }
            uc=[]
            k=0
            for (var i in c1) {
                found = false
                for (var j in uc) {
                    if(JSON.stringify(uc[j])==JSON.stringify(c1[i])) found = true
                }
                if(!found) {uc[k]=c1[i]; k++}
            }
            isp =[]
           for(var i in results1) {
            isp.push(results1[i].isp)
           }
        var sql="select count(case when cache_control LIKE '%max-stale%' then 1 end)*100/(select count(*) from req_headers left join requests on reqhead_id = req_id where content_type in (?) OR isp in (?)) as max_stale,count(case when cache_control LIKE '%min-fresh%' then 1 end)*100/(select count(*) from req_headers left join requests on reqhead_id = req_id where content_type in (?) OR isp in (?)) as min_fresh from req_headers left join requests on reqhead_id = req_id where content_type in (?) OR isp in (?)"
        con=["text/html","text/javascript"]
        db.query(sql,[session.contype,session.isp,session.contype,session.isp,session.contype,session.isp],function(error,result){
            console.log(result)
            perc=[]
            for(var i in result){
                perc[i]={max_stale:result[i].max_stale,min_fresh:result[i].min_fresh}
            }
            console.log(perc)
            res.render('chart3.ejs',{prc: JSON.stringify(perc),contypes: uc, disp:isp})
                })
            })
        })
        }
        else res.redirect("/login")
    })
    
    router.post('/chart3', (req,res)=>{
        
        session.posted = true;
        cont = req.body.data.replace("[","").replace("]","")
        isps = req.body.data1.replace("[","").replace("]","")
        nct =[]
        nct1 = []
        for(var i = 0; i<cont.split(',').length; i++) {
            
            nct.push(cont.split(',')[i].replace('"',"").replace('"',""))
        }
        for(var i = 0; i<isps.split(',').length; i++) {
            
            nct1.push(isps.split(',')[i].replace('"',"").replace('"',""))
        }
        
        session.contype = nct;
        session.isp = nct1
       
        res.redirect("/chart3")
    })
module.exports=router;
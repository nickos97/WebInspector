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

router.get('/chart2', (req,res)=>{
    if(session.loggedin) {
    var sql = "SELECT COUNT(reshead_id)  as count,cache_control,content_type from res_headers left join requests on reshead_id = req_id where content_type in (?) OR isp in (?) GROUP BY  cache_control"
    ct = ['text/css', 'text/javascript']
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
        
        
        if(!session.posted) {
            session.contype = [""]
            session.isp = [""]
            
        }
        
    db.query(sql,[session.contype,session.isp],function(error,result){
        ttl= []
        found = false;
        for(var i in result) {
            if(result[i].cache_control != null) {
                if(result[i].cache_control.includes("max-age")) {
                    

                    for(var j in result[i].cache_control.split(',')) {
                        if(result[i].cache_control.split(',')[j].includes("max-age")) {
                            var max = result[i].cache_control.split(',')[j].split('=')[1]
                        }
                        
                    }
                    console.log(found)
                    for(var k in ttl) {
                        if(parseInt(ttl[k].max_age) == parseInt(max)){
                            found =true;
                            ttl[k].count = ttl[k].count + result[i].count
                            
                        }
                    }
                    if(found) {
                        found = false;
                        continue;
                    }
                    ttl.push({count: result[i].count, max_age: max})
                    
                    
                }
            }
        }
        console.log(ttl)
        console.log(result)
        
        
        
        res.render('chart2.ejs',{ttls: JSON.stringify(ttl), contypes: uc, disp:isp})
    })
 })
})
}else res.redirect("/login") 
})
router.post('/chart2', (req,res)=>{
    
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
   
    res.redirect("/chart2")
})
module.exports = router;
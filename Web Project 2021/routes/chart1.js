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

router.get('/chart1', (req,res)=>{
    if(session.loggedin) {
    var sql = "select avg(timings.wait) as average, extract(hour from timestamp(starteddatetime)) as hour from timings left join entries on timings_id = ent_id left join res_headers on ent_id = reshead_id left join requests on reshead_id = req_id where content_type in (?) OR method in (?) OR requests.isp in (?) OR dayname(starteddatetime) in (?)  group by extract(hour from timestamp(starteddatetime)) order by extract(hour from timestamp(starteddatetime))";
        day = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        db.query("select distinct(content_type) from res_headers",function(error,result){
            db.query("select distinct(method) from requests",function(error1,result1){
                db.query("select distinct(isp) from requests",function(error2,result2){
                    isp=[]
                    for(var i in result2) {
                        isp[i]=result2[i].isp
                    }
                    

                
            
                method=[]
                for(var i in result1) {
                    method[i]=result1[i].method
                }
            
            
        c1=[]
        for(var i=0; i<result.length; i++) {
            if(result[i].content_type!=null)
                c1.push(result[i].content_type)
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

        if(!session.posted) {
            session.contype = [""]
            session.method=[""]
            session.isp=[""]
            session.day=[""]
        }
        db.query(sql,[session.contype,session.method,session.isp,session.day],function(err,results){
            if(err) throw err;
        
        avg = JSON.stringify(results)
        
        
        
        res.render('chart1.ejs',{ct: uc,average: avg,methods: method,isps: isp,days: day})
    })
    })
    })
})
    }
    else res.redirect("/login")
})

router.post('/chart1', (req,res)=>{
    console.log('posted')
    session.posted = true;
    ct = req.body.data.replace("[","").replace("]","")
    ct1 = req.body.data1.replace("[","").replace("]","")
    ct2 = req.body.data2.replace("[","").replace("]","")
    ct3 = req.body.data3.replace("[","").replace("]","")
    nct =[]
    nct1 = []
    nct2 = []
    nct3 = []
    for(var i = 0; i<ct.split(',').length; i++) {
        
        nct.push(ct.split(',')[i].replace('"',"").replace('"',""))
    }
    for(var i = 0; i<ct1.split(',').length; i++) {
        
        nct1.push(ct1.split(',')[i].replace('"',"").replace('"',""))
    }
    for(var i = 0; i<ct2.split(',').length; i++) {
        
        nct2.push(ct2.split(',')[i].replace('"',"").replace('"',""))
    }
    for(var i = 0; i<ct3.split(',').length; i++) {
        
        nct3.push(ct3.split(',')[i].replace('"',"").replace('"',""))
    }
   console.log(nct)
   console.log(nct1)
   console.log(nct2)
    /*db.query('select avg(timings.wait) as average, extract(hour from timestamp(starteddatetime)) as hour from timings left join entries on timings.timings_id = ent_id left join res_headers on ent_id = reshead_id where content_type in (?) group by extract(hour from timestamp(starteddatetime)) order by extract(hour from timestamp(starteddatetime))',[nct],function(error,results){
        if(error) throw error;
        
        avg1 =JSON.stringify(results)
        console.log(avg1)
        res.render('chart1.ejs')
    })*/
    session.contype = nct
    session.method = nct1
    session.isp = nct2
    session.day = nct3
    res.redirect("/chart1")
})


    

module.exports = router;
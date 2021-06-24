const express = require('express');
var mysql = require('mysql');
const router = express.Router();
var session = require('express-session');
const db = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'Nickos1997',
	database : 'har_db'
});
router.get('/Info',(req,res)=>{
    if(session.loggedin) {
    var users = function(callback) {
        var sql = "SELECT COUNT(user_id) as count from users";
        db.query(sql, function(error,results,fields){
            if(error) throw error;
            return callback(results)
            
        })
    }
    var methods = function(callback) {
         var sql = "SELECT COUNT(req_id) as count,method from requests GROUP BY method";
         db.query(sql, function(error,results1,fields) {
          if(error) throw error;
          return callback(results1)
        })
    }
    var status = function(callback) {
        var sql = "SELECT COUNT(res_id) as count,status from responses GROUP BY status";
        db.query(sql, function(error,results2,fields) {
         if(error) throw error;
         return callback(results2)
        })
    }
   var domains = function(callback) {
    var sql = "SELECT COUNT(DISTINCT url) as count FROM requests";
    db.query(sql, function(error,results3,fields) {
     if(error) throw error;
     return callback(results3)
        })
    }
var ISPs = function(callback) {
    var sql = "SELECT COUNT(DISTINCT ISP) as count FROM har_file";
    db.query(sql, function(error,results4,fields) {
     if(error) throw error;
     return callback(results4)
        })
    }
var AVG = function(callback) {
        var sql = "select * from res_headers";
        db.query(sql,function(error,results5){
           if(error) throw error;
           ctypes = []
            avg = []
            p=0
            for(var i=0; i<results5.length; i++) {
                
                found=0;
                sum=0;
                sumage1=0;
                c1 = results5[i].content_type;
        
                if(c1 != null && results5[i].age != null)
                c1 = c1.split(';')[0]
                else continue;
        
                /*if(c1 == 'text/javascript' || c1 == 'application/x-javascript')
                c1='application/javascript'*/
        
                for(var k in ctypes) {
                    if(c1 == ctypes[k])
                    found=1
                }
                if(found == 1) 
                continue;
                
                
                for(var j=0; j<results5.length; j++) {
                    c2 = results5[j].content_type
                    if(c2 != null && results5[j].age != null)
                    c2 = c2.split(';')[0]
                    else continue;
                    if(c1 == c2) {
                        sumage1 = sumage1 + results5[j].age
                        sum++
                    }
                }
                ctypes[p] = c1;
                avg[p] = (sumage1/sum).toFixed(2)
                p++
            }
            return callback(avg,ctypes)
        })
}
    users(function(results) {
    methods(function(results1){
    status(function(results2){
    domains(function(results3){
    ISPs(function(results4){
    AVG(function(avg,ctypes){
            
    
    
    res.render('Info.ejs', {userData:results[0].count, userData1: results1, userData2: results2,
                 userData3: results3[0].count, userData4: results4[0].count, 
                 userData5: avg, userData6: ctypes});
    
    })
    })   
    })
    })
    })
    })    
}
else res.redirect("/login")
})


module.exports = router;
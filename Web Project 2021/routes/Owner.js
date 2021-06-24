const express = require('express');
var mysql = require('mysql');
const router = express.Router();
var session = require('express-session');
geoip=require("geoip-lite")

const db = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'Nickos1997',
	database : 'har_db'
});

router.get("/Owner", (req,res)=> {
    session.role=1
    console.log(session.loggedin)
    if(session.loggedin) {
    var sql = "select username from users where role = 1";
    db.query(sql, function(error,results){
        if(error) throw error;
        db.query("select h_id,serveripaddress from entries", function(err,sresults){
            if(err) throw err;
            var geo=[]
            /*for (var i in sresults) {
                ips[i]=sresults[i].serveripaddress
            }*/
            z=0
            for(var i in sresults) {
                if(sresults[i].serveripaddress!=null){
                    ip=sresults[i].serveripaddress.replace("[","").replace("]","")
                    if(geoip.lookup(ip)!=null){
                    geo[z]={id: sresults[i].h_id, lat:geoip.lookup(ip).ll[0],long:geoip.lookup(ip).ll[1]}
                        z++
                    }
                }
            }
            console.log(geo)
            db.query("select har_id,longitude,latitude from har_file", function(er,uresults){
            if(er) throw er;
            loc=[]
            marker=[]
            for (var i in uresults) {
                loc.push([uresults[i].latitude,uresults[i].longitude])
                marker.push({id: uresults[i].har_id, lat: uresults[i].latitude, long: uresults[i].longitude})
            }
            console.log(marker)
    
            
            uloc=[]
            k=0

            for (var i in loc) {
                found = false
                for (var j in uloc) {
                    if(JSON.stringify(uloc[j])==JSON.stringify(loc[i])) found = true
                }
                if(!found) {uloc[k]=loc[i]; k++}
            }

            res.render("Owner.ejs", {name: session.username,loc: JSON.stringify(uloc), target: JSON.stringify(geo),marker: JSON.stringify(marker) })
            })
        })
    })
}
else res.redirect("/login")


    
    
})

router.post("/Owner",(req,res)=>{
    
    console.log("signout pressed")
    session.loggedin=false;
    
})

module.exports = router;
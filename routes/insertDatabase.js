var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});

var mysql = require('mysql')
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'toor',
    password: 'toor',
    database: 'school'
})

function verifyCarIns(req, res){
    res.status(200).send(req.body.id)
}

function getRows(req, res){
    console.log('connected as id ' + connection.threadId);
        var resp
        resp = "<table align=\"center\"> <tr> <th>Id</th> <th>career</th></tr>"
        /// start query
        var query = connection.query('Select * from careers where id like \'%'+req+'%\'');
        query
            .on('error', function(err) {
                console.log(err);
            })
            .on('result', function(row) {
                console.log(row);
                resp += "<tr>"
                resp += "<td>"+row.id +"</td>"
                resp += "<td>"+row.career +"</td>"
                resp += "</tr>"
                return;
            })
            .on('end', function(){
                resp += "</table>"
                res.send(200, resp);
            });
}


router.get('/',  (req, res) => {
    console.log(req.body.id)
    verifyCarIns(req, res)
    //getRows("", res)
});

module.exports = router;

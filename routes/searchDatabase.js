var express = require('express');
var router = express.Router();

var mysql = require('mysql')
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'toor',
    password: 'toor',
    database: 'school'
})


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

/* GET home page. */
router.get('/:id', function(req, res, next) {
    console.log(req)
    getRows(req.params.id, res);
});
router.get('/', function(req, res, next) {
    getRows("", res);
});

module.exports = router;

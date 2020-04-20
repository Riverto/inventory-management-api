var express = require('express');
var router = express.Router();

var mysql = require('mysql')
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'toor',
    password: 'toor',
    database: 'school'
})


function getRows(res){
    console.log('connected as id ' + connection.threadId);
        var resp
        var resp_rows = {'data':[]};
        resp = "<table align=\"center\"> <tr> <th>Id</th> <th>career</th></tr>"
        /// start query
        var query = connection.query('Select * from careers');
        query
            .on('error', function(err) {
                console.log(err);
            })
            .on('result', function(row) {
                nrow = {
                    'id': row.id,
                    'career': row.career
                }
                resp_rows.data.push(nrow);
                console.log(row);
                resp += "<tr>"
                resp += "<td>"+row.id +"</td>"
                resp += "<td>"+row.career +"</td>"
                resp += "</tr>"
                return;
            })
            .on('end', function(){
                resp += "</table>"
                res.send(200, resp_rows);
                console.log(resp_rows)
            });
}

/* GET home page. */
router.get('/', function(req, res, next) {
    getRows(res);
});

module.exports = router;

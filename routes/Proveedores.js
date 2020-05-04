var express = require('express');
var router = express.Router();

var mysql = require('mysql')
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'toor',
    password: 'toor',
    database: 'almacen'
})



function sendToDatabase(req, res){
    var data = req.body
    var query = connection.query("Insert into proveedor (nombre, correo, telefono) " +
    "values ('"+ data.nombre+"', '"+ data.correo+"', '"+ data.telefono+"')");
        query
            .on('error', function(err) {
                console.log(this.sql)
                res.status(200).send("Error While Inserting" + err)
            })
            .on('result', function(row) {
                res.send(201, "Inserted Correctly");
                console.log(row);
            });
}


function getFromDatabase(res){
            var resp_rows = {'data':[]};
            /// start query
            var query = connection.query('Select * from articulo');
            query
                .on('error', function(err) {
                    console.log(err);
                })
                .on('result', function(row) {
                    nrow = {
                        'id_proveedor': row.id_proveedor,
                        'nombre': row.nombre,
                        'correo': row.correo,
                        'telefono': row.telefono,
                    }
                    resp_rows.data.push(nrow);
                    console.log(row);
                    return;
                })
                .on('end', function(){
                    res.status(200).send(resp_rows);
                    console.log(resp_rows)
                });
    }


router.post('/insert',  (req, res) => {
    console.log(req.body)
    sendToDatabase(req,res)
});


router.get('/show', (req,res) => {
    console.log(req)
    getFromDatabase(res)
});

module.exports = router;

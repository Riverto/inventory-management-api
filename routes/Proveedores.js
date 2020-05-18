var express = require('express');
var router = express.Router();

var mysql = require('mysql')
var connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
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
            var query = connection.query('Select * from proveedor');
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

function getAllfromDatabase(req,res){
    let resp_rows = {'data':[],'page':req.params.page,'total':0};
    /// start query
    var query = connection.query('Select * from proveedor');
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
            resp_rows.total = resp_rows.data.length
            res.status(200).send(resp_rows);
            console.log(resp_rows)
        });
}

router.get('/show/:page', (req,res) => {
    console.log(req.params.page)
    getAllfromDatabase(req,res)
});

router.post('/insert',  (req, res) => {
    console.log(req.body)
    sendToDatabase(req,res)
});


router.get('/show', (req,res) => {
    console.log(req)
    getFromDatabase(res)
});

module.exports = router;

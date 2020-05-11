var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var mysql = require('mysql')
var connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
})

const saltRounds = 10;

function sendToDatabase(req, res){
    var data = req.body
    
    bcrypt.hash(data.contrasena, saltRounds, function(err, hash) {
        var query = connection.query("Insert into usuario (nombre_usuario, nombre, apellido, contrasena, tipo_usuario) " +
    "values ('"+ data.nombre_usuario + "', '"+ data.nombre+"', '"+ data.apellido+"', '"+ hash +"', '"+ data.tipo_usuario+"')");
        query
            .on('error', function(err) {
                console.log(this.sql)
                res.status(200).send("Error While Inserting" + err + data)
            })
            .on('result', function(row) {
                res.send(201, "Inserted Correctly" + data);
                console.log(row);
            });
    });
}


function getFromDatabase(res){
            var resp_rows = {'data':[]};
            /// start query
            var query = connection.query('Select * from usuario');
            query
                .on('error', function(err) {
                    console.log(err);
                })
                .on('result', function(row) {
                    nrow = {
                        'id_usuario': row.id_usuario,
                        'nombre_usuario': row.nombre_usuario,
                        'nombre': row.nombre,
                        'apellido': row.apellido,
                        'contrasena' : row.contrasena,
                        'tipo_usuario': row.tipo_usuario,
                        'fecha_alta': row.fecha_alta,
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

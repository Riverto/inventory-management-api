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
    "values ('"+ data.nombre_usuario + "', '"+ data.nombre+"', '"+ data.apellido+"', '"+ hash +"', '"+ data.tipo+"')");
        query
            .on('error', function(err) {
                console.log(this.sql)
                res.status(200).send("Error While Inserting: User may already exist")
            })
            .on('result', function(row) {
                res.send(201, "Inserted Correctly");
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

function getAllfromDatabase(req,res){
    let resp_rows = {'data':[],'page':req.params.page,'total':0};
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
            resp_rows.total = resp_rows.data.length
            res.status(200).send(resp_rows);
            console.log(resp_rows)
        });
}
//p
//{}
function verifyLogin(req,res){
    var data = req.body
    var hash
    var id
    var query = connection.query("Select contrasena, id_usuario from usuario where nombre_usuario = '"+data.nombre_usuario+"'");
    query
    .on('error', function(err) {
        console.log(err);
    })
    .on('result', function(row) {
        console.log(row)
        hash = row.contrasena
        console.log(bcrypt.compareSync(data.contrasena, hash))
        if(bcrypt.compareSync(data.contrasena, hash)){
            id = row.id_usuario
        } else {
            id = -1
        }
    })
    .on('end', function(){
        res.status(200).send(id.toString());
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

router.post('/login', (req,res) => {
    console.log(req)
    verifyLogin(req, res)
});

module.exports = router;

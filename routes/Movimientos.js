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
    var query = connection.query("Insert into movimientos (tipo, descripcion, id_usuario) " +
    "values ('"+data.tipo+"', '"+ data.descripcion+"', '"+ data.id_usuario+"');");
        query
            .on('error', function(err) {
                console.log(this.sql)
                res.status(200).send("Error While Inserting" + err)
            })
            .on('result', function(row) {
                var iquery = connection.query("SELECT LAST_INSERT_ID() as id")
                iquery
                .on('error', function(err) {
                    console.log(this.sql)
                    res.status(200).send("Error on select" + err)
                })
                .on('result', function(iRow) {
                    res.send(201, {'id' : iRow.id});
                    console.log(row);
                })
            });
}

function sendArticleToDatabase(req, res){
    var data = req.body
    var query = connection.query("Insert into articulos_mov (index_articulos, index_movimiento, cantidad) " +
    "values ('"+data.sku+"', '"+ req.params.index+"', '"+ data.cantidad+"');");
        query
            .on('error', function(err) {
                console.log(this.sql)
                res.status(200).send("Error While Inserting" + err)
            })
            .on('result', function(row) {
                res.status(201).send("Inserted Correctly");
                    console.log(row);
            });
}

function getFromDatabase(req,res){
            let resp_rows = {'data':[],'page':0,'totalCount':0};
            let query = connection.query('SELECT articulo.sku, articulo.nombre_articulo, articulo.descripcion, articulo.costo, articulo.unidad_medida, articulos_mov.cantidad, proveedor.nombre from articulos_mov,articulo,proveedor where articulo.sku = articulos_mov.index_articulos and proveedor.id_proveedor = articulo.id_proveedor and articulos_mov.index_movimiento = '+req.params.index)
            query
            .on('error', function(err) {
                console.log(err)
            })
            .on('result',function(row){
                nrow = {
                    'sku': row.sku,
                    'nombre_articulo': row.nombre_articulo,
                    'descripcion': row.descripcion,
                    'costo': row.costo,
                    'unidad_medida': row.unidad_medida,
                    'cantidad':row.cantidad,
                    'nombre_proveedor': row.nombre,
                }
                resp_rows.data.push(nrow)
            })
            .on('end', function(){
                resp_rows.totalCount = resp_rows.data.length
                res.status(201).send(resp_rows);
                console.log(resp_rows)
            })
}


router.get('/load/:index', (req, res) => {
    console.log(req.body)
    getFromDatabase(req,res)
});

router.post('/insert',  (req, res) => {
    console.log(req.body)
    sendToDatabase(req,res)
});

router.post('/insertArticulo/:index',  (req, res) => {
    console.log(req.body)
    sendArticleToDatabase(req,res)
});


router.get('/show', (req,res) => {
    console.log(req)
    getFromDatabase(res)
});

module.exports = router;

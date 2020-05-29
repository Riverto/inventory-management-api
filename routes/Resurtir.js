var express = require('express');
var router = express.Router();

var mysql = require('mysql')
var connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
})

function getAllfromDatabase(req,res){
    let resp_rows = {'data':[],'page':req.params.page,'totalCount':0};
    /// start query
    var query = connection.query('SELECT articulo.sku, articulo.nombre_articulo as nombre_articulo, articulo.resurtir, sum(CASE WHEN movimientos.tipo = "e" THEN articulos_mov.cantidad WHEN movimientos.tipo = "s" THEN articulos_mov.cantidad * -1 ELSE 0 END) as cantidadarticulos, proveedor.nombre from articulo left join articulos_mov on articulo.sku = articulos_mov.index_articulos left join movimientos on articulos_mov.index_movimiento = movimientos.num_mov left join proveedor on articulo.id_proveedor = proveedor.id_proveedor GROUP by sku HAVING cantidadarticulos <= resurtir order by cantidadarticulos ASC');
    query
        .on('error', function(err) {
            console.log(err);
        })
        .on('result', function(row) {
            nrow = {
                'sku': row.sku,
                'nombre_articulo': row.nombre_articulo,
                'cantidad': row.cantidadarticulos,
                'proveedor': row.nombre,
            }
            resp_rows.data.push(nrow);
            console.log(row);
            return;
        })
        .on('end', function(){
            resp_rows.totalCount = resp_rows.data.length
            resp_rows.data = resp_rows.data.slice((resp_rows.page-1)*req.params.per,((resp_rows.page)*req.params.per))
            res.status(200).send(resp_rows);
            console.log(resp_rows)
        });
}

function searchDatabase(req,res){
    let resp_rows = {'data':[],'page':req.params.page,'totalCount':0};
    /// start query
    var query = connection.query('SELECT articulo.sku, articulo.nombre_articulo as nombre_articulo, articulo.resurtir, sum(CASE WHEN movimientos.tipo = "e" THEN articulos_mov.cantidad WHEN movimientos.tipo = "s" THEN articulos_mov.cantidad * -1 ELSE 0 END) as cantidadarticulos, proveedor.nombre from articulo left join articulos_mov on articulo.sku = articulos_mov.index_articulos left join movimientos on articulos_mov.index_movimiento = movimientos.num_mov left join proveedor on articulo.id_proveedor = proveedor.id_proveedor where (sku like "'+req.params.search+'%" or nombre_articulo like "%'+req.params.search+'%" or nombre like "%'+req.params.search+'%")GROUP by sku HAVING cantidadarticulos <= resurtir order by cantidadarticulos ASC');
    query
        .on('error', function(err) {
            console.log(err);
        })
        .on('result', function(row) {
            nrow = {
                'sku': row.sku,
                'nombre_articulo': row.nombre_articulo,
                'cantidad': row.cantidadarticulos,
                'proveedor': row.nombre,
            }
            resp_rows.data.push(nrow);
            console.log(row);
            return;
        })
        .on('end', function(){
            resp_rows.totalCount = resp_rows.data.length
            resp_rows.data = resp_rows.data.slice((resp_rows.page-1)*req.params.per,((resp_rows.page)*req.params.per))
            res.status(200).send(resp_rows);
            console.log(resp_rows)
        });
}

router.get('/show/:page/:per', (req,res) => {
    console.log(req.params.page)
    console.log(req.params.per)
    getAllfromDatabase(req,res)
});

router.get('/search/:page/:per/:search', (req,res) => {
    console.log(req.params.page)
    console.log(req.params.per)
    searchDatabase(req,res)
});

module.exports = router;
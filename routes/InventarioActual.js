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
    let resp_rows = {'data':[],'page':req.params.page,'total':0};
    /// start query
    //var query = connection.query('SELECT a.sku, a.nombre_articulo, SUM(CASE WHEN b.tipo="e" THEN c.cantidad ELSE 0 END) AS cantidadarticulos, a.costo, (SUM(CASE WHEN b.tipo="e" THEN c.cantidad ELSE 0 END)*a.costo) AS costototal FROM articulo a, movimientos b, articulos_mov c WHERE a.sku=c.index_articulos and b.num_mov=c.index_movimiento GROUP BY a.sku');
    var query = connection.query('SELECT articulo.sku, articulo.nombre_articulo, sum(CASE WHEN movimientos.tipo = "e" THEN articulos_mov.cantidad WHEN movimientos.tipo = "s" THEN articulos_mov.cantidad * -1 ELSE 0 END) as cantidadarticulos, articulo.costo, sum(CASE WHEN movimientos.tipo = "e" THEN articulos_mov.cantidad WHEN movimientos.tipo = "s" THEN articulos_mov.cantidad * -1 ELSE 0 END) * costo as costototal from articulo left join articulos_mov on articulo.sku = articulos_mov.index_articulos left join movimientos on articulos_mov.index_movimiento = movimientos.num_mov GROUP by sku');
    query
        .on('error', function(err) {
            console.log(err);
        })
        .on('result', function(row) {
            nrow = {
                'sku': row.sku,
                'nombre_articulo': row.nombre_articulo,
                'cantidad': row.cantidadarticulos,
                'costo': row.costo,
                'costototal': row.costototal,
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


module.exports = router;
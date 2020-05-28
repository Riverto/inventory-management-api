var express = require('express');
var router = express.Router();

var mysql = require('mysql')
var connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
})

function getfromDatabase(res){
    let resp_rows = {'data': 0};
    /// start query
    var query = connection.query('SELECT FORMAT(sum(costototal),2) as valorInventario from (SELECT sum(CASE WHEN movimientos.tipo = "e" THEN articulos_mov.cantidad WHEN movimientos.tipo = "s" THEN articulos_mov.cantidad * -1 ELSE 0 END) as cantidadarticulos, articulo.costo, sum(CASE WHEN movimientos.tipo = "e" THEN articulos_mov.cantidad WHEN movimientos.tipo = "s" THEN articulos_mov.cantidad * -1 ELSE 0 END) * costo as costototal from articulo left join articulos_mov on articulo.sku = articulos_mov.index_articulos left join movimientos on articulos_mov.index_movimiento = movimientos.num_mov GROUP by sku) sums');
    query
        .on('error', function(err) {
            console.log(err);
        })
        .on('result', function(row) {
            resp_rows.data = row.valorInventario;
            console.log(row);
            return;
        })
        .on('end', function(){
            res.status(200).send(resp_rows);
            console.log(resp_rows)
        });
}

router.get('/load', (req,res) => {
    getfromDatabase(res)
});


module.exports = router;
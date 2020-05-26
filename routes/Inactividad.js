var express = require('express');
var router = express.Router();

var mysql = require('mysql')
var connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
})
//select articulo.sku as sku, articulo.nombre_articulo as nombre, sum( CASE WHEN movimientos.tipo = "e" THEN articulos_mov.cantidad ELSE articulos_mov.cantidad * -1 END ) as cantidad, max(movimientos.fecha_alta) as ultima, abs(DATEDIFF(movimientos.fecha_alta,CURRENT_DATE())) as diff from articulo, movimientos, articulos_mov where articulos_mov.index_articulos = articulo.sku and movimientos.num_mov = articulos_mov.index_movimiento


function getAllfromDatabase(req,res){
    let resp_rows = {'data':[],'page':req.params.page,'totalCount':0};
    /// start query
    var query = connection.query('select articulo.sku as sku, articulo.nombre_articulo as nombre, sum( CASE WHEN movimientos.tipo = "e" THEN articulos_mov.cantidad ELSE articulos_mov.cantidad * -1 END ) as cantidad, max(movimientos.fecha_alta) as ultima, abs(DATEDIFF(movimientos.fecha_alta,CURRENT_DATE())) as diff from articulo, movimientos, articulos_mov where articulos_mov.index_articulos = articulo.sku and movimientos.num_mov = articulos_mov.index_movimiento GROUP by articulo.sku ORDER by diff desc');
    query
        .on('error', function(err) {
            console.log(err);
        })
        .on('result', function(row) {
            nrow = {
                'sku': row.sku,
                'nombre': row.nombre,
                'cantidad': row.cantidad,
                'ultima': row.ultima,
                'diff': row.diff
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


module.exports = router;
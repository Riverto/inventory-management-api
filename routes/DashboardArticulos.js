var express = require('express');
var router = express.Router();

var mysql = require('mysql')
var connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
})

function getFromDatabase(res){
            //var resp
            var resp_rows = {'data':[]};
            //resp = "<table align=\"center\"> <tr> <th>Id</th> <th>career</th></tr>"
            /// start query
            var query = connection.query('SELECT a.nombre_articulo, SUM(CASE WHEN d.tipo="e" THEN c.cantidad ELSE 0 END) as cantidadarticulos FROM articulo a, articulos_mov c, movimientos d WHERE a.sku=c.index_articulos and c.index_movimiento=d.num_mov GROUP BY a.sku HAVING SUM(CASE WHEN d.tipo="e" THEN c.cantidad ELSE 0 END) <= 10 ORDER BY SUM(CASE WHEN d.tipo="e" THEN c.cantidad ELSE 0 END) ASC LIMIT 4');
            query
                .on('error', function(err) {
                    console.log(err);
                })
                .on('result', function(row) {
                    nrow = {
                        'nombre_articulo': row.nombre_articulo,
                        'cantidad': row.cantidadarticulos,
                    }
                    resp_rows.data.push(nrow);
                    console.log(row);
                    return;
                })
                .on('end', function(){
                    //resp += "</table>"
                    res.status(200).send(resp_rows);
                    console.log(resp_rows)
                });
    }

function getAllfromDatabase(req,res){
    let resp_rows = {'data':[],'page':req.params.page,'total':0};
    /// start query
    var query = connection.query('SELECT a.nombre_articulo, SUM(CASE WHEN d.tipo="e" THEN c.cantidad ELSE 0 END) as cantidadarticulos FROM articulo a, articulos_mov c, movimientos d WHERE a.sku=c.index_articulos and c.index_movimiento=d.num_mov GROUP BY a.sku HAVING SUM(CASE WHEN d.tipo="e" THEN c.cantidad ELSE 0 END) <= 10 ORDER BY SUM(CASE WHEN d.tipo="e" THEN c.cantidad ELSE 0 END) ASC LIMIT 4');
     query
        .on('error', function(err) {
            console.log(err);
        })
        .on('result', function(row) {
            nrow = {
                'nombre_articulo': row.nombre_articulo,
                'cantidad': row.cantidadarticulos,
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

router.get('/show', (req,res) => {
    console.log(req)
    getFromDatabase(res)
});

module.exports = router;

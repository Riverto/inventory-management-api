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
    var query = connection.query("Insert into articulo (sku, nombre_articulo, descripcion, costo, unidad_medida, fecha_alta, id_usuario, id_proveedor) " +
    "values ('"+data.sku+"', '"+ data.nombre_articulo+"', '"+ data.descripcion+"', '"+ data.costo+"', '"+ data.unidad_medida+"', '"+ data.fecha_alta+"', '"+ data.id_usuario+"', '"+ data.id_proveedor+"')");
        query
            .on('error', function(err) {
                console.log(this.sql)
                //res.status(200).send("Error While Inserting" + err)
                res.redirect(303,"http://localhost:3000/articles")
            })
            .on('result', function(row) {
                res.send(201, "Inserted Correctly");
                console.log(row);
            });
}

/*

sku
nombre_articulo
descripcion
costo
unidad_medida
fecha_alta
id_usuario
id_proveedor

*/
function getFromDatabase(res){
            var resp
            var resp_rows = {'data':[]};
            resp = "<table align=\"center\"> <tr> <th>Id</th> <th>career</th></tr>"
            /// start query
            var query = connection.query('Select * from articulo');
            query
                .on('error', function(err) {
                    console.log(err);
                })
                .on('result', function(row) {
                    nrow = {
                        'sku': row.sku,
                        'nombre_articulo': row.nombre_articulo,
                        'descripcion': row.descripcion,
                        'costo': row.costo,
                        'unidad_medida': row.unidad_medida,
                        'fecha_alta': row.fecha_alta,
                        'id_usuario': row.id_usuario,
                        'id_proveedor': row.id_proveedor,
                    }
                    resp_rows.data.push(nrow);
                    console.log(row);
                    return;
                })
                .on('end', function(){
                    resp += "</table>"
                    res.status(200).send(resp_rows);
                    console.log(resp_rows)
                });
    }


router.post('/insert',  (req, res) => {
    console.log(req.body)
    sendToDatabase(req,res)
    //verifyCarIns(req, res)
    //getRows("", res)
});


router.get('/show', (req,res) => {
    console.log(req)
    getFromDatabase(res)
});

module.exports = router;

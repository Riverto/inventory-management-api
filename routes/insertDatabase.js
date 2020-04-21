var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');

var mysql = require('mysql')
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'toor',
    password: 'toor',
    database: 'almacen'
})



function sendToDatabase(req, res){
    var data = req.body
    var query = connection.query("Insert into articulo (sku, nombre_articulo, descripcion, costo, unidad_medida, fecha_alta, id_usuario, id_proveedor) " +
    "values ('"+data.sku+"', '"+ data.nombre_articulo+"', '"+ data.descripcion+"', '"+ data.costo+"', '"+ data.unidad_medida+"', '"+ data.fecha_alta+"', '"+ data.id_usuario+"', '"+ data.id_proveedor+"')");
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


router.post('/',  (req, res) => {
    console.log(req.body)
    sendToDatabase(req,res)
    //verifyCarIns(req, res)
    //getRows("", res)
});

module.exports = router;

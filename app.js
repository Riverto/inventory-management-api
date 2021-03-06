var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
require('dotenv').config()
const bcrypt = require('bcrypt');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPIRouter = require("./routes/testAPI");
var readDatabaseRouter = require("./routes/readDatabase");
var searchDatabaseRouter = require("./routes/searchDatabase");
var insertDatabaseRouter = require("./routes/insertDatabase");
var articulosRouter = require("./routes/Articulos");
var proveedoresRouter = require("./routes/Proveedores");
var usuariosRouter = require("./routes/Usuarios");
var movimientosRouter = require("./routes/Movimientos");
var inventarioactualRouter = require("./routes/InventarioActual");
var resurtirRouter = require("./routes/Resurtir");
var inactividadRouter = require("./routes/Inactividad");
var dashboardarticuloRouter = require("./routes/DashboardArticulos");
var valorInventarioRouter = require("./routes/valorInventario");


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/testAPI", testAPIRouter);
app.use("/dbtest", readDatabaseRouter);
app.use("/search", searchDatabaseRouter);
app.use("/insert",insertDatabaseRouter);
app.use("/articulos", articulosRouter);
app.use("/proveedores", proveedoresRouter);
app.use("/usuarios", usuariosRouter);
app.use("/movimientos", movimientosRouter);
app.use("/inventarioactual", inventarioactualRouter);
app.use("/resurtir", resurtirRouter);
app.use("/inactividad", inactividadRouter);
app.use("/valor", valorInventarioRouter);
app.use("/dashboardarticulos", dashboardarticuloRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

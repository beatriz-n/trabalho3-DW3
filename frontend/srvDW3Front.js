var createError = require('http-errors');
var nunjucks = require("nunjucks")
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const session = require('express-session');



const envFilePath = path.resolve(__dirname, './srvDW3Front.env');
require('dotenv').config({ path: envFilePath });

const port = process.env.PORT
var rtIndex = require('./routes/rtIndex');
var rtClientes = require('./routes/rtClientes');
var rtCarros = require('./routes/rtCarros');
var rtVagas = require('./routes/rtVagas');
var rtReservas = require('./routes/rtReservas');
jwtchave = process.env.JWTCHAVE;



var app = express();

nunjucks.configure('apps', {
  autoescape: true,
  express: app,
  watch: true
}).addFilter("currency", function (value, locale, currency) {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(value || 0);
});;

app.use(express.static(__dirname));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.JWTCHAVE,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: null },
  })
);


app.use('/', rtIndex);
app.use('/clientes', rtClientes);
app.use('/carros', rtCarros);
app.use('/vagas', rtVagas);
app.use('/reservas', rtReservas);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

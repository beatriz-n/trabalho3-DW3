const express = require("express");
const routerApp = express.Router();

const appLogin = require("../apps/login/controller/ctlLogin");
const appCliente = require("../apps/cliente/controller/ctlClientes");
const appCarro = require("../apps/carro/controller/ctlCarros");

routerApp.use((req, res, next) => {
  next();
});

routerApp.post("/Login", appLogin.Login);
routerApp.post("/Logout", appLogin.Logout);

// Rotas de Cliente
routerApp.get("/getAllClientes", appLogin.AutenticaJWT, appCliente.getAllClientes);
routerApp.post("/getClienteByID", appLogin.AutenticaJWT, appCliente.getClienteByID);
routerApp.post("/insertClientes", appLogin.AutenticaJWT, appCliente.insertClientes);
routerApp.post("/updateClientes", appLogin.AutenticaJWT, appCliente.updateClientes);
routerApp.post("/DeleteClientes", appLogin.AutenticaJWT, appCliente.DeleteClientes);

// Rotas de Carro
routerApp.get("/getAllCarros", appLogin.AutenticaJWT, appCarro.getAllCarros);
routerApp.post("/getCarroByID", appLogin.AutenticaJWT, appCarro.getCarroByID);
routerApp.post("/insertCarros", appLogin.AutenticaJWT, appCarro.insertCarros);
routerApp.post("/updateCarros", appLogin.AutenticaJWT, appCarro.updateCarros);
routerApp.post("/DeleteCarros", appLogin.AutenticaJWT, appCarro.DeleteCarros);

module.exports = routerApp;

const express = require("express");
const routerApp = express.Router();

const appLogin = require("../apps/login/controller/ctlLogin");
const appCliente = require("../apps/cliente/controller/ctlClientes");
const appCarro = require("../apps/carro/controller/ctlCarros");
const appVaga = require("../apps/vaga/controller/ctlVagas");

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

// Rotas de Vaga
routerApp.get("/getAllVagas", appLogin.AutenticaJWT, appVaga.getAllVagas);
routerApp.post("/getVagaByID", appLogin.AutenticaJWT, appVaga.getVagaByID);
routerApp.post("/insertVagas", appLogin.AutenticaJWT, appVaga.insertVagas);
routerApp.post("/updateVagas", appLogin.AutenticaJWT, appVaga.updateVagas);
routerApp.post("/DeleteVagas", appLogin.AutenticaJWT, appVaga.DeleteVagas);

module.exports = routerApp;

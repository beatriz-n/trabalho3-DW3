var express = require('express');
var router = express.Router();
var ClientesApp = require("../apps/cliente/controller/ctlClientes");

// Função necessária para evitar que usuários não autenticados acessem o sistema.
function authenticationMiddleware(req, res, next) {
    // Verificar se existe uma sessão válida.
    isLogged = req.session.isLogged;    

    if (!isLogged) {      
        res.redirect("/Login");
    }
    next();
}; 

/* GET métodos */
router.get('/ManutClientes', authenticationMiddleware, ClientesApp.manutClientes);
router.get('/InsertClientes', authenticationMiddleware, ClientesApp.insertClientes);
router.get('/ViewClientes/:id', authenticationMiddleware, ClientesApp.viewClientes);
router.get('/UpdateClientes/:id', authenticationMiddleware, ClientesApp.updateClientes);

/* POST métodos */
router.post('/InsertClientes', authenticationMiddleware, ClientesApp.insertClientes);
router.post('/UpdateClientes', authenticationMiddleware, ClientesApp.updateClientes);
router.post('/DeleteClientes', authenticationMiddleware, ClientesApp.deleteClientes);

module.exports = router;
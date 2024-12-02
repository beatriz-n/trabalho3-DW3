var express = require('express');
var router = express.Router();
var ClientesApp = require("../apps/agencias/controller/ctlClientes")

//Função necessária para evitar que usuários não autenticados acessem o sistema.
function authenticationMiddleware(req, res, next) {
    // Verificar se existe uma sessão válida.
    isLogged = req.session.isLogged;    
  
    if (!isLogged) {      
      res.redirect("/Login");
    }
    next();
}; 
  
/* GET métodos */
router.get('/ManutClientes', authenticationMiddleware, ClientesApp.manutClientes)
router.get('/InsertClientes', authenticationMiddleware, ClientesApp.insertClientes);
router.get('/ViewClientes/:id', authenticationMiddleware, ClientesApp.ViewClientes);
router.get('/UpdateClientes/:id', authenticationMiddleware, ClientesApp.UpdateCliente);

/* POST métodos */
router.post('/InsertClientes', authenticationMiddleware, ClientesApp.insertClientes);
router.post('/UpdateClientes', authenticationMiddleware, ClientesApp.UpdateCliente);
router.post('/DeleteClientes', authenticationMiddleware, ClientesApp.DeleteCliente);
// router.post('/viewClientes', authenticationMiddleware, ClientesApp.viewClientes);

module.exports = router;
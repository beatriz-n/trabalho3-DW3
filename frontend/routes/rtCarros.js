var express = require('express');
var router = express.Router();
var CarrosApp = require("../apps/carro/controller/ctlCarros");
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
router.get('/ManutCarros', authenticationMiddleware, CarrosApp.manutCarros)
router.get('/InsertCarros', authenticationMiddleware, CarrosApp.insertCarros);
router.get('/ViewCarros/:id', authenticationMiddleware, CarrosApp.viewCarros);
router.get('/UpdateCarros/:id', authenticationMiddleware, CarrosApp.updateCarros);

/* POST métodos */
router.post('/InsertCarros', authenticationMiddleware, CarrosApp.insertCarros);
router.post('/UpdateCarros', authenticationMiddleware, CarrosApp.updateCarros);
router.post('/DeleteCarros', authenticationMiddleware, CarrosApp.deleteCarros);
// router.post('/viewCarros', authenticationMiddleware, CarrosApp.viewCarros);

module.exports = router;
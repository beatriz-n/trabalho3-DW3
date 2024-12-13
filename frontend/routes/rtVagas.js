var express = require('express');
var router = express.Router();
var VagasApp = require("../apps/vaga/controller/ctlVagas");
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
router.get('/ManutVagas', authenticationMiddleware, VagasApp.manutVagas);
router.get('/InsertVagas', authenticationMiddleware, VagasApp.insertVagas);
router.get('/ViewVagas/:id', authenticationMiddleware, VagasApp.viewVagas);
router.get('/UpdateVagas/:id', authenticationMiddleware, VagasApp.updateVagas);

/* POST métodos */
router.post('/InsertVagas', authenticationMiddleware, VagasApp.insertVagas);
router.post('/UpdateVagas', authenticationMiddleware, VagasApp.updateVagas);
router.post('/DeleteVagas', authenticationMiddleware, VagasApp.deleteVagas);

module.exports = router;
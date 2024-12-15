var express = require('express');
var router = express.Router();
var VagasApp = require("../apps/vaga/controller/ctlVagas");
function authenticationMiddleware(req, res, next) {
    isLogged = req.session.isLogged;    
  
    if (!isLogged) {      
      res.redirect("/Login");
    }
    next();
}; 
  
router.get('/ManutVagas', authenticationMiddleware, VagasApp.manutVagas);
router.get('/InsertVagas', authenticationMiddleware, VagasApp.insertVagas);
router.get('/ViewVagas/:id', authenticationMiddleware, VagasApp.viewVagas);
router.get('/UpdateVagas/:id', authenticationMiddleware, VagasApp.updateVagas);
router.get('/getTotalVagas',authenticationMiddleware, VagasApp.getTotalVagas);

router.post('/InsertVagas', authenticationMiddleware, VagasApp.insertVagas);
router.post('/UpdateVagas', authenticationMiddleware, VagasApp.updateVagas);
router.post('/DeleteVagas', authenticationMiddleware, VagasApp.deleteVagas);

module.exports = router;
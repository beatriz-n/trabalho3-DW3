var express = require('express');
var router = express.Router();
var ReservasApp = require("../apps/reserva/controller/ctlReservas");
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
router.get('/ManutReservas', authenticationMiddleware, ReservasApp.manutReservas)
router.get('/InsertReservas', authenticationMiddleware, ReservasApp.insertReservas);
router.get('/ViewReservas/:id', authenticationMiddleware, ReservasApp.viewReservas);
router.get('/UpdateReservas/:id', authenticationMiddleware, ReservasApp.updateReservas);

/* POST métodos */
router.post('/InsertReservas', authenticationMiddleware, ReservasApp.insertReservas);
router.post('/UpdateReservas', authenticationMiddleware, ReservasApp.updateReservas);
router.post('/DeleteReservas', authenticationMiddleware, ReservasApp.deleteReservas);

module.exports = router;
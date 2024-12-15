var express = require('express');
var router = express.Router();
var loginApp = require("../apps/login/controller/ctlLogin")
var homeApp = require("../apps/home/controller/ctlHome")

function authenticationMiddleware(req, res, next) {
  isLogged = req.session.isLogged;

  if (!isLogged) {
    return res.redirect("/Login");
  }

  next();
};

router.get('/', authenticationMiddleware, homeApp.homePage); // Alteração aqui para chamar a função homePage

router.get('/Login', loginApp.Login);

router.post('/Login', loginApp.Login);

router.get('/Logout', loginApp.Logout);

module.exports = router;
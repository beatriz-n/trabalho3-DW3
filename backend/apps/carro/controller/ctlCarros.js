const mdlCarros = require("../model/mdlCarros");

const getAllCarros = (req, res) =>
  (async () => {
    let registro = await mdlCarros.getAllCarros();
    for (let i = 0; i < registro.length; i++) {
      const row = registro[i];
    }
    res.json({ status: "ok", "registro": registro });
  })();

const getCarroByID = (req, res) =>
  (async () => {
    const carroID = parseInt(req.body.id);
    let registro = await mdlCarros.getCarroByID(carroID);
    res.json({ status: "ok", "registro": registro });
  })();

const insertCarros = (request, res) =>
  (async () => {
    const carroREG = request.body;
    let { msg, linhasAfetadas } = await mdlCarros.insertCarros(carroREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

const updateCarros = (request, res) =>
  (async () => {
    const carroREG = request.body;
    let { msg, linhasAfetadas } = await mdlCarros.updateCarros(carroREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

const DeleteCarros = (request, res) =>
  (async () => {
    const carroREG = request.body;
    let { msg, linhasAfetadas } = await mdlCarros.deleteCarros(carroREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

module.exports = {
  getAllCarros,
  getCarroByID,
  insertCarros,
  updateCarros,
  DeleteCarros
};
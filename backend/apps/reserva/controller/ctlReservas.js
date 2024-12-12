const mdlReservas = require("../model/mdlReservas");

const getAllReservas = (req, res) =>
  (async () => {
    let registro = await mdlReservas.getAllReservas();
    for (let i = 0; i < registro.length; i++) {
      const row = registro[i];
    }
    res.json({ status: "ok", "registro": registro });
  })();

const getReservaByID = (req, res) =>
  (async () => {
    const reservaID = parseInt(req.body.id);
    let registro = await mdlReservas.getReservaByID(reservaID);
    res.json({ status: "ok", "registro": registro });
  })();

const insertReservas = (request, res) =>
  (async () => {
    const reservaREG = request.body;
    let { msg, linhasAfetadas } = await mdlReservas.insertReservas(reservaREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

const updateReservas = (request, res) =>
  (async () => {
    const reservaREG = request.body;
    let { msg, linhasAfetadas } = await mdlReservas.updateReservas(reservaREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

const DeleteReservas = (request, res) =>
  (async () => {
    const reservaREG = request.body;
    let { msg, linhasAfetadas } = await mdlReservas.deleteReservas(reservaREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

module.exports = {
  getAllReservas,
  getReservaByID,
  insertReservas,
  updateReservas,
  DeleteReservas
};
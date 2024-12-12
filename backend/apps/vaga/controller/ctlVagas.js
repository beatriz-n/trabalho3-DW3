const mdlVagas = require("../model/mdlVagas");

const getAllVagas = (req, res) =>
  (async () => {
    let registro = await mdlVagas.getAllVagas();
    for (let i = 0; i < registro.length; i++) {
      const row = registro[i];
    }
    res.json({ status: "ok", "registro": registro });
  })();

const getVagaByID = (req, res) =>
  (async () => {
    const vagaID = parseInt(req.body.id);
    let registro = await mdlVagas.getVagaByID(vagaID);
    res.json({ status: "ok", "registro": registro });
  })();

const insertVagas = (request, res) =>
  (async () => {
    const vagaREG = request.body;
    let { msg, linhasAfetadas } = await mdlVagas.insertVagas(vagaREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

const updateVagas = (request, res) =>
  (async () => {
    const vagaREG = request.body;
    let { msg, linhasAfetadas } = await mdlVagas.updateVagas(vagaREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

const DeleteVagas = (request, res) =>
  (async () => {
    const vagaREG = request.body;
    let { msg, linhasAfetadas } = await mdlVagas.deleteVagas(vagaREG);
    res.json({ "status": msg, "linhasAfetadas": linhasAfetadas });
  })();

module.exports = {
  getAllVagas,
  getVagaByID,
  insertVagas,
  updateVagas,
  DeleteVagas
};
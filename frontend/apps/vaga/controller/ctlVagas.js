const axios = require("axios");
const moment = require("moment");

const manutVagas = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;

    const resp = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllVagas", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    
    }).catch(error => {
      if (error.code === "ECONNREFUSED") {
        remoteMSG = "Servidor indisponível"

      } else if (error.code === "ERR_BAD_REQUEST") {
        remoteMSG = "Usuário não autenticado";

      } else {
        remoteMSG = error;
      }
      res.render("vaga/view/vwManutVagas.njk", {
        title: "Manutenção de Vagas",
        data: null,
        erro: remoteMSG,
        userName: userName,
      });
    });

    if (!resp) {
      return;
    }


    res.render("vaga/view/vwManutVagas.njk", {
      title: "Manutenção de Vagas",
      data: resp.data.registro,
      erro: null,
      userName: userName,
    });
  })();

const insertVagas = async (req, res) =>
  (async () => {
    if (req.method == "GET") {
      const token = req.session.token;

      return res.render("vaga/view/vwFCrVagas.njk", {
        title: "Cadastro de Contas a Pagar",
        data: null,
        erro: null, 
        userName: null,
      });

    } else {
      const regData = req.body;
      const token = req.session.token;

      try {
        const response = await axios.post(process.env.SERVIDOR_DW3Back + "/insertVagas", regData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 5000,
        });


        res.json({
          status: response.data.status,
          msg: response.data.status,
          data: response.data,
          erro: null,
        });
      } catch (error) {
        console.error('Erro ao inserir dados no servidor backend:', error.message);
        res.json({
          status: "Error",
          msg: error.message,
          data: response.data,
          erro: null,
        });
      }
    }
  })();

const viewVagas = async (req, res) =>
  (async () => {
    const token = req.session.token;
    const userName = req.session.userName;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        oper = req.params.oper;
        parseInt(id);
        response = await axios.post(process.env.SERVIDOR_DW3Back + "/getVagaByID",
          {
            id: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        if (response.data.status == "ok") {
          res.render("vaga/view/vwFRUDrVagas.njk", {
            title: "Visualização de Vagas",
            data: response.data.registro[0],
            disabled: true,
            userName: userName,
          });
        } else {
          console.log("[ctlVagas|viewVagas] ID de vaga não localizado!");
        }

      }
    } catch (erro) {
      res.json({ status: "[ctlVagas|viewVagas] Vagas não localizado!" });
      console.log(
        "[ctlVagas.js|viewVagas] Try Catch: Erro não identificado", erro);
    }
  })();

const updateVagas = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        parseInt(id);
        response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/getVagaByID",
          {
            id: id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        if (response.data.status == "ok") {
          res.render("vaga/view/vwFRUDrVagas.njk", {
            title: "Atualização de dados do Vaga",
            data: response.data.registro[0],
            disabled: false,
            userName: userName,
          });
        } else {
          console.log("[ctlVagas|UpdateVagas] Dados não localizados");
        }
      } else {
        const regData = req.body;
        const token = req.session.token;
        try {
          const response = await axios.post(process.env.SERVIDOR_DW3Back + "/updateVagas", regData, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            timeout: 5000,
          });

          res.json({
            status: response.data.status,
            msg: response.data.status,
            data: response.data,
            erro: null,
          });
        } catch (error) {
          console.error('[ctlVagas.js|UpdateVagas] Erro ao atualiza dados do vaga no servidor backend:', error.message);
          res.json({
            status: "Error",
            msg: error.message,
            data: response.data,
            erro: null,
          });
        }
      }
    } catch (erro) {
      res.json({ status: "[ctlVagas.js|UpdateVagas] Vagas não localizado!" });
      console.log(
        "[ctlVagas.js|UpdateVagas] Try Catch: Erro não identificado",
        erro
      );
    }

  })();

const deleteVagas = async (req, res) =>
  (async () => {
    const regData = req.body;
    const token = req.session.token;

    try {
      const response = await axios.post(process.env.SERVIDOR_DW3Back + "/DeleteVagas", regData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        timeout: 5000,
      });

      res.json({
        status: response.data.status,
        msg: response.data.status,
        data: response.data,
        erro: null,
      });
    } catch (error) {
      console.error('[ctlVagas.js|DeleteVagas] Erro ao deletar dados do vaga no servidor backend:', error.message);
      res.json({
        status: "Error",
        msg: error.message,
        data: response.data,
        erro: null,
      });
    }
  })();

module.exports = {
  manutVagas,
  insertVagas,
  viewVagas,
  updateVagas,
  deleteVagas
};
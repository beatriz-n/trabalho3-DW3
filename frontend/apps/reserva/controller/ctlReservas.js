const axios = require("axios");
const moment = require("moment");

const manutReservas = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;

    const resp = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllReservas", {
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
      res.render("reserva/view/vwManutReservas.njk", {
        title: "Manutenção de Reservas",
        data: null,
        erro: remoteMSG,
        userName: userName,
      });
    });

    if (!resp) {
      return;
    }

    res.render("reserva/view/vwManutReservas.njk", {
      title: "Manutenção de Reservas",
      data: resp.data.registro,
      erro: null,
      userName: userName,
    });
  })();

const insertReservas = async (req, res) =>
  (async () => {
    if (req.method == "GET") {
      const token = req.session.token;

      const vagas = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllVagas", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const carros = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllCarros", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      // Filtrar disponíveis
      const vagasDisponiveis = vagas.data.registro.filter(vaga => vaga.status === false);      

      return res.render("reserva/view/vwFCrReservas.njk", {
        title: "Cadastro de Reservas",
        data: null,
        erro: null,
        vaga: vagasDisponiveis,
        carro: carros.data.registro,
        userName: null,
      });

    } else {
      const regData = req.body;
      const token = req.session.token;

      try {
        const response = await axios.post(process.env.SERVIDOR_DW3Back + "/insertReservas", regData, {
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

const viewReservas = async (req, res) =>
  (async () => {
    const token = req.session.token;
    const userName = req.session.userName;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        oper = req.params.oper;
        parseInt(id);
        response = await axios.post(process.env.SERVIDOR_DW3Back + "/getReservaByID",
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
          const vagas = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllVagas", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          });

          const carros = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllCarros", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          });

          // Filtrar disponíveis
          const vagasDisponiveis = vagas.data.registro.filter(vaga => vaga.status === false);          

          res.render("reserva/view/vwFRUDrReservas.njk", {
            title: "Visualização de Reservas",
            data: response.data.registro[0],
            disabled: true,
            vaga: vagasDisponiveis,
            carro: carros.data.registro,
            userName: userName,
          });
        } else {
          console.log("[ctlReservas|viewReservas] ID de reserva não localizado!");
        }

      }
    } catch (erro) {
      res.json({ status: "[ctlReservas|viewReservas] Reservas não localizadas!" });
      console.log(
        "[ctlReservas.js|viewReservas] Try Catch: Erro não identificado", erro);
    }
  })();

const updateReservas = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        parseInt(id);
        response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/getReservaByID",
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
          const carros = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllCarros", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          });

          const vagas = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllVagas", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          });

          // Filtrar disponíveis
          const vagasDisponiveis = vagas.data.registro.filter(vaga => vaga.status === false);          

          res.render("reserva/view/vwFRUDrReservas.njk", {
            title: "Atualização de dados da Reserva",
            data: response.data.registro[0],
            disabled: false,
            vaga: vagasDisponiveis,
            carro: carros.data.registro,
            userName: userName,
          });
        } else {
          console.log("[ctlReservas|UpdateReservas] Dados não localizados");
        }
      } else {
        const regData = req.body;
        const token = req.session.token;
        try {
          const response = await axios.post(process.env.SERVIDOR_DW3Back + "/updateReservas", regData, {
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
          console.error('[ctlReservas.js|UpdateReservas] Erro ao atualizar dados da reserva no servidor backend:', error.message);
          res.json({
            status: "Error",
            msg: error.message,
            data: response.data,
            erro: null,
          });
        }
      }
    } catch (erro) {
      res.json({ status: "[ctlReservas.js|UpdateReservas] Reservas não localizadas!" });
      console.log(
        "[ctlReservas.js|UpdateReservas] Try Catch: Erro não identificado",
        erro
      );
    }

  })();

const deleteReservas = async (req, res) =>
  (async () => {
    const regData = req.body;
    const token = req.session.token;

    try {
      const response = await axios.post(process.env.SERVIDOR_DW3Back + "/DeleteReservas", regData, {
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
      console.error('[ctlReservas.js|DeleteReservas] Erro ao deletar dados da reserva no servidor backend:', error.message);
      res.json({
        status: "Error",
        msg: error.message,
        data: response.data,
        erro: null,
      });
    }
  })();

module.exports = {
  manutReservas,
  insertReservas,
  viewReservas,
  updateReservas,
  deleteReservas
};

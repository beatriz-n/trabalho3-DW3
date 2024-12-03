const axios = require("axios");
const moment = require("moment");

const manutClientes = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;

    const resp = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllClientes", {
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
      res.render("cliente/view/vwManutClientes.njk", {
        title: "Manutenção de Clientes",
        data: null,
        erro: remoteMSG,
        userName: userName,
      });
    });

    if (!resp) {
      return;
    }


    res.render("cliente/view/vwManutClientes.njk", {
      title: "Manutenção de Clientes",
      data: resp.data.registro,
      erro: null,
      userName: userName,
    });
  })();

const insertClientes = async (req, res) =>
  (async () => {
    if (req.method == "GET") {
      const token = req.session.token;

      return res.render("cliente/view/vwFCrClientes.njk", {
        title: "Cadastro de Contas a Pagar",
        data: null,
        erro: null, 
        userName: null,
      });

    } else {
      const regData = req.body;
      const token = req.session.token;

      try {
        const response = await axios.post(process.env.SERVIDOR_DW3Back + "/insertClientes", regData, {
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

const viewClientes = async (req, res) =>
  (async () => {
    const token = req.session.token;
    const userName = req.session.userName;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        oper = req.params.oper;
        parseInt(id);
        response = await axios.post(process.env.SERVIDOR_DW3Back + "/getClienteByID",
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
          res.render("cliente/view/vwFRUDrClientes.njk", {
            title: "Visualização de Clientes",
            data: response.data.registro[0],
            disabled: true,
            userName: userName,
          });
        } else {
          console.log("[ctlClientes|viewClientes] ID de cliente não localizado!");
        }

      }
    } catch (erro) {
      res.json({ status: "[ctlClientes|viewClientes] Clientes não localizado!" });
      console.log(
        "[ctlClientes.js|viewClientes] Try Catch: Erro não identificado", erro);
    }
  })();

const updateClientes = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        parseInt(id);
        response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/getClienteByID",
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
          res.render("cliente/view/vwFRUDrClientes.njk", {
            title: "Atualização de dados do Cliente",
            data: response.data.registro[0],
            disabled: false,
            userName: userName,
          });
        } else {
          console.log("[ctlClientes|UpdateClientes] Dados não localizados");
        }
      } else {
        const regData = req.body;
        const token = req.session.token;
        try {
          const response = await axios.post(process.env.SERVIDOR_DW3Back + "/updateClientes", regData, {
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
          console.error('[ctlClientes.js|UpdateClientes] Erro ao atualiza dados do cliente no servidor backend:', error.message);
          res.json({
            status: "Error",
            msg: error.message,
            data: response.data,
            erro: null,
          });
        }
      }
    } catch (erro) {
      res.json({ status: "[ctlClientes.js|UpdateClientes] Clientes não localizado!" });
      console.log(
        "[ctlClientes.js|UpdateClientes] Try Catch: Erro não identificado",
        erro
      );
    }

  })();

const deleteClientes = async (req, res) =>
  (async () => {
    const regData = req.body;
    const token = req.session.token;

    try {
      const response = await axios.post(process.env.SERVIDOR_DW3Back + "/DeleteClientes", regData, {
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
      console.error('[ctlClientes.js|DeleteClientes] Erro ao deletar dados do cliente no servidor backend:', error.message);
      res.json({
        status: "Error",
        msg: error.message,
        data: response.data,
        erro: null,
      });
    }
  })();

module.exports = {
  manutClientes,
  insertClientes,
  viewClientes,
  updateClientes,
  deleteClientes
};
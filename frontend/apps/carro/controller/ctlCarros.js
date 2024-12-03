const axios = require("axios");
const moment = require("moment");

const manutCarros = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;

    const resp = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllCarros", {
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
      res.render("carro/view/vwManutCarros.njk", {
        title: "Manutenção de Carros",
        data: null,
        erro: remoteMSG,
        userName: userName,
      });
    });

    if (!resp) {
      return;
    }


    res.render("carro/view/vwManutCarros.njk", {
      title: "Manutenção de Carros",
      data: resp.data.registro,
      erro: null,
      userName: userName,
    });
  })();

const insertCarros = async (req, res) =>
  (async () => {
    if (req.method == "GET") {
      const token = req.session.token;

      const clientes = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllClientes", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      return res.render("carro/view/vwFCrCarros.njk", {
        title: "Cadastro de Carros",
        data: null,
        erro: null, 
        cliente: clientes.data.registro,
        userName: null,
      });

    } else {
      const regData = req.body;
      const token = req.session.token;

      try {
        const response = await axios.post(process.env.SERVIDOR_DW3Back + "/insertCarros", regData, {
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

const viewCarros = async (req, res) =>
  (async () => {
    const token = req.session.token;
    const userName = req.session.userName;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        oper = req.params.oper;
        parseInt(id);
        response = await axios.post(process.env.SERVIDOR_DW3Back + "/getCarroByID",
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
            const clientes = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllClientes", {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
                }
            });

            res.render("carro/view/vwFRUDrCarros.njk", {
                title: "Visualização de Carros",
                data: response.data.registro[0],
                disabled: true,
                cliente: clientes.data.registro,
                userName: userName,
          });
        } else {
          console.log("[ctlCarros|viewCarros] ID de carro não localizado!");
        }

      }
    } catch (erro) {
      res.json({ status: "[ctlCarros|viewCarros] Carros não localizado!" });
      console.log(
        "[ctlCarros.js|viewCarros] Try Catch: Erro não identificado", erro);
    }
  })();

const updateCarros = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        parseInt(id);
        response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/getCarroByID",
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
            const clientes = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllClientes", {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
                }
            });

          res.render("carro/view/vwFRUDrCarros.njk", {
            title: "Atualização de dados do Cliente",
            data: response.data.registro[0],
            disabled: false,
            cliente: clientes.data.registro,
            userName: userName,
          });
        } else {
          console.log("[ctlCarros|UpdateCarros] Dados não localizados");
        }
      } else {
        const regData = req.body;
        const token = req.session.token;
        try {
          const response = await axios.post(process.env.SERVIDOR_DW3Back + "/updateCarros", regData, {
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
          console.error('[ctlCarros.js|UpdateCarros] Erro ao atualiza dados do carro no servidor backend:', error.message);
          res.json({
            status: "Error",
            msg: error.message,
            data: response.data,
            erro: null,
          });
        }
      }
    } catch (erro) {
      res.json({ status: "[ctlCarros.js|UpdateCarros] Carros não localizado!" });
      console.log(
        "[ctlCarros.js|UpdateCarros] Try Catch: Erro não identificado",
        erro
      );
    }

  })();

const deleteCarros = async (req, res) =>
  (async () => {
    const regData = req.body;
    const token = req.session.token;

    try {
      const response = await axios.post(process.env.SERVIDOR_DW3Back + "/DeleteCarros", regData, {
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
      console.error('[ctlCarros.js|DeleteCarros] Erro ao deletar dados do carro no servidor backend:', error.message);
      res.json({
        status: "Error",
        msg: error.message,
        data: response.data,
        erro: null,
      });
    }
  })();

module.exports = {
  manutCarros,
  insertCarros,
  viewCarros,
  updateCarros,
  deleteCarros
};
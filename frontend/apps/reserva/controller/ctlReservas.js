const axios = require("axios");
const moment = require("moment");

const manutReservas = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;

    try {
      // Buscar todas as reservas
      const reservasResponse = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllReservas", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      // Buscar todos os carros
      const carrosResponse = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllCarros", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      // Buscar todas as vagas
      const vagasResponse = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllVagas", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const reservas = reservasResponse.data.registro;
      const carros = carrosResponse.data.registro;
      const vagas = vagasResponse.data.registro;

      // Adicionar informações de carro e vaga às reservas
      const reservasComDetalhes = reservas.map(reserva => {
        const carro = carros.find(carro => carro.id === reserva.carro_id) || {};
        const vaga = vagas.find(vaga => vaga.id === reserva.vaga_id) || {};
        return {
          ...reserva,
          modelo: carro.modelo || "Não informado",
          placa: carro.placa || "Não informado",
          descricaoVaga: vaga.descricao || "Não informada",
          data_entrada: moment(reserva.data_entrada).format("DD/MM/YYYY HH:mm"),
          data_saida: reserva.data_saida
            ? moment(reserva.data_saida).format("DD/MM/YYYY HH:mm")
            : "Em aberto"
        };
      });

      res.render("reserva/view/vwManutReservas.njk", {
        title: "Manutenção de Reservas",
        data: reservasComDetalhes,
        erro: null,
        userName: userName,
      });
    } catch (error) {
      const remoteMSG = error.code === "ECONNREFUSED"
        ? "Servidor indisponível"
        : error.code === "ERR_BAD_REQUEST"
          ? "Usuário não autenticado"
          : error.message;

      res.render("reserva/view/vwManutReservas.njk", {
        title: "Manutenção de Reservas",
        data: null,
        erro: remoteMSG,
        userName: userName,
      });
    }
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

        // Obter a reserva pelo ID
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
          const reserva = response.data.registro[0]; // Dados da reserva
          const vagaIdReserva = reserva.vaga_id; // ID da vaga associada à reserva

          // Função para formatar as datas no formato "YYYY-MM-DDTHH:mm"
          const formatDatetimeLocal = (datetime) => {
            if (!datetime) return ''; // Retorna vazio se não houver data
            return moment(datetime).format('YYYY-MM-DDTHH:mm');
          };

          reserva.data_entrada = formatDatetimeLocal(reserva.data_entrada);
          reserva.data_saida = formatDatetimeLocal(reserva.data_saida);

          // Obter todas as vagas e carros
          const vagas = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllVagas", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const carros = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllCarros", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          // Filtrar vagas disponíveis
          const vagasDisponiveis = vagas.data.registro.filter(vaga => vaga.status === false || vaga.id === vagaIdReserva);

          // Renderizar a página com as vagas ajustadas e reserva formatada
          res.render("reserva/view/vwFRUDrReservas.njk", {
            title: "Visualização de Reservas",
            data: reserva,
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
      console.log("[ctlReservas.js|viewReservas] Try Catch: Erro não identificado", erro);
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

        // Obter a reserva pelo ID
        const response = await axios.post(
          process.env.SERVIDOR_DW3Back + "/getReservaByID",
          { id: id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (response.data.status === "ok") {
          const reserva = response.data.registro[0]; // Dados da reserva
          const vagaIdReserva = reserva.vaga_id; // ID da vaga associada à reserva

          // Formatar datas para o formato "YYYY-MM-DDTHH:mm"
          const formatDatetimeLocal = (datetime) => {
            if (!datetime) return ''; // Retorna vazio se não houver data
            return moment(datetime).format('YYYY-MM-DDTHH:mm');
          };

          reserva.data_entrada = formatDatetimeLocal(reserva.data_entrada);
          reserva.data_saida = formatDatetimeLocal(reserva.data_saida);

          // Obter os carros e vagas
          const carros = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllCarros", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const vagas = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllVagas", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          // Filtrar vagas disponíveis ou a vaga associada à reserva
          const vagasDisponiveis = vagas.data.registro.filter(
            (vaga) => vaga.status === false || vaga.id === vagaIdReserva
          );

          // Renderizar a página com as vagas ajustadas
          res.render("reserva/view/vwFRUDrReservas.njk", {
            title: "Atualização de dados da Reserva",
            data: reserva,
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
          const response = await axios.post(
            process.env.SERVIDOR_DW3Back + "/updateReservas",
            regData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              timeout: 5000,
            }
          );

          res.json({
            status: response.data.status,
            msg: response.data.status,
            data: response.data,
            erro: null,
          });
        } catch (error) {
          console.error(
            "[ctlReservas.js|UpdateReservas] Erro ao atualizar dados da reserva no servidor backend:",
            error.message
          );
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
      console.log("[ctlReservas.js|UpdateReservas] Try Catch: Erro não identificado", erro);
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

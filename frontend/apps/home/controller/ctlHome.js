const axios = require('axios'); // Adicionando a importação do axios

const homePage = async (req, res) => {
  const token = req.session.token;
  const userName = req.session.userName;

  try {
    const vagas = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllVagas", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const clientes = await axios.get(process.env.SERVIDOR_DW3Back + "/getAllClientes", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const vagasDisponiveis = vagas.data.registro.filter(vaga => vaga.status === false).length;
    const vagasOcupadas = vagas.data.registro.filter(vaga => vaga.status === true).length;
    const totalVagas = vagas.data.registro.length;
    const totalClientes = clientes.data.registro.length;

    // Soma das mensalidades
    const totalMensalidades = clientes.data.registro.reduce((soma, cliente) => {
      const mensalidade = parseFloat(cliente.mensalidade) || 0;
      return soma + mensalidade;
    }, 0);

    res.render("home/view/index.njk", {
      parametros: { title: "Dashboard" },
      data: {
        vagas_disponiveis: vagasDisponiveis,
        vagas_ocupadas: vagasOcupadas,
        total_vagas: totalVagas,
        total_clientes: totalClientes,
        total_mensalidades: totalMensalidades
      },
      userName: userName,
    });
  } catch (error) {
    console.error("[homePage] Erro ao carregar dados de vagas:", error.message);
    res.render("home/view/index.njk", {
      parametros: { title: "Dashboard" },
      data: { vagas_disponiveis: 0, vagas_ocupadas: 0, total_vagas: 0, total_clientes: 0, total_mensalidades: "0.00" },
      userName: userName,
    });
  }
};

module.exports = {
  homePage,
};

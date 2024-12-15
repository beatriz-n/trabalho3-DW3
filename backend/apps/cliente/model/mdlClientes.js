const db = require("../../../database/databaseconfig");

const getAllClientes = async () => {
  return (
    await db.query(
      "SELECT * FROM clientes WHERE removido = false ORDER BY nome ASC"
    )
  ).rows;
};

const getClienteByID = async (clienteIDPar) => {
  return (
    await db.query(
      "SELECT * FROM clientes WHERE id = $1 AND removido = false",
      [clienteIDPar]
    )
  ).rows;
};

const insertClientes = async (clienteREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "INSERT INTO clientes (nome, email, telefone) " +
        "VALUES ($1, $2, $3)",
        [
          clienteREGPar.nome,
          clienteREGPar.email,
          clienteREGPar.telefone,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlClientes|insertClientes] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const updateClientes = async (clienteREGPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    const result = await db.query(
      "UPDATE clientes SET " +
        "nome = $2, " +
        "email = $3, " +
        "telefone = $4, " +
        "mensalidade = $5 " +
        "WHERE id = $1",
      [
        clienteREGPar.id,
        clienteREGPar.nome,
        clienteREGPar.email,
        clienteREGPar.telefone,
        clienteREGPar.mensalidade,
      ]
    );
    linhasAfetadas = result.rowCount;
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    msg = "[mdlClientes|updateClientes] " + (error.detail || error.message || "Erro desconhecido");
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const deleteClientes = async (clienteREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE clientes SET removido = true WHERE id = $1",
        [clienteREGPar.id]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlClientes|deleteClientes] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

module.exports = {
  getAllClientes,
  getClienteByID,
  insertClientes,
  updateClientes,
  deleteClientes,
};
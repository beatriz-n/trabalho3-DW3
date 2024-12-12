const db = require("../../../database/databaseconfig");

// Buscar todas as reservas
const getAllReservas = async () => {
  return (
    await db.query(
      "SELECT * FROM vagacarro WHERE removido = false ORDER BY data_entrada ASC"
    )
  ).rows;
};

// Buscar uma reserva pelo ID
const getReservaByID = async (reservaIDPar) => {
  return (
    await db.query(
      "SELECT * FROM vagacarro WHERE id = $1 AND removido = false",
      [reservaIDPar]
    )
  ).rows;
};

// Inserir uma nova reserva
const insertReservas = async (reservaREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "INSERT INTO vagacarro (carro_id, vaga_id, data_entrada, data_saida) " +
        "VALUES ($1, $2, $3, $4)",
        [
          reservaREGPar.carro_id,
          reservaREGPar.vaga_id,
          reservaREGPar.data_entrada,
          reservaREGPar.data_saida,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlReservas|insertReservas] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

// Atualizar uma reserva existente
const updateReservas = async (reservaREGPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    const result = await db.query(
      "UPDATE vagacarro SET " +
        "carro_id = $2, " +
        "vaga_id = $3, " +
        "data_entrada = $4, " +
        "data_saida = $5 " +    
        "WHERE id = $1",
      [
        reservaREGPar.id,   
        reservaREGPar.carro_id,
        reservaREGPar.vaga_id,
        reservaREGPar.data_entrada,
        reservaREGPar.data_saida,      
      ]
    );
    linhasAfetadas = result.rowCount;
  } catch (error) {
    console.error("Erro ao atualizar reserva:", error);
    msg = "[mdlReservas|updateReservas] " + (error.detail || error.message || "Erro desconhecido");
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

// Marcar uma reserva como removida
const deleteReservas = async (reservaREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE vagacarro SET removido = true WHERE id = $1",
        [reservaREGPar.id]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlReservas|deleteReservas] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

module.exports = {
  getAllReservas,
  getReservaByID,
  insertReservas,
  updateReservas,
  deleteReservas,
};
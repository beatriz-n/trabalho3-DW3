const db = require("../../../database/databaseconfig");

// Buscar todas as vagas
const getAllVagas = async () => {
  return (
    await db.query(
      "SELECT * FROM vagas WHERE removido = false ORDER BY descricao ASC"
    )
  ).rows;
};

// Buscar uma vaga pelo ID
const getVagaByID = async (vagaIDPar) => {
  return (
    await db.query(
      "SELECT * FROM vagas WHERE id = $1 AND removido = false",
      [vagaIDPar]
    )
  ).rows;
};

// Inserir uma nova vaga
const insertVagas = async (vagaREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "INSERT INTO vagas (descricao) " +
        "VALUES ($1)",
        [
          vagaREGPar.descricao       
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlVagas|insertVagas] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

// Atualizar uma vaga existente
const updateVagas = async (vagaREGPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    const result = await db.query(
      "UPDATE vagas SET " +
        "descricao = $2, " +
        "status = $3 " +        
        "WHERE id = $1",
      [
        vagaREGPar.id,
        vagaREGPar.descricao,
        vagaREGPar.status,        
      ]
    );
    linhasAfetadas = result.rowCount;
  } catch (error) {
    console.error("Erro ao atualizar vaga:", error);
    msg = "[mdlVagas|updateVagas] " + (error.detail || error.message || "Erro desconhecido");
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

// Marcar uma vaga como removida
const deleteVagas = async (vagaREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE vagas SET removido = true WHERE id = $1",
        [vagaREGPar.id]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlVagas|deleteVagas] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

  const getTotalVagas = async () => {
    return (
      await db.query(
        "SELECT COUNT(*) AS total_vagas, COUNT(CASE WHEN status = FALSE AND removido = FALSE THEN 1 END) AS vagas_disponiveis, COUNT(CASE WHEN status = TRUE AND removido = FALSE THEN 1 END) AS vagas_ocupadas FROM Vagas;"
      )
    ).rows;
  };

module.exports = {
  getAllVagas,
  getVagaByID,
  insertVagas,
  updateVagas,
  deleteVagas,
  getTotalVagas
};
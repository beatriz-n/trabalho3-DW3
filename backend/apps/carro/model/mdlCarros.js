const db = require("../../../database/databaseconfig");

const getAllCarros = async () => {
  return (
    await db.query(
      "SELECT *, (SELECT nome FROM clientes WHERE id = carros.cliente_id AND clientes.removido != true) FROM carros WHERE removido = false ORDER BY modelo ASC"
    )
  ).rows;
};

const getCarroByID = async (carroIDPar) => {
  return (
    await db.query(
      "SELECT *, (SELECT nome FROM clientes WHERE id = carros.cliente_id AND clientes.removido != true) FROM carros WHERE id = $1 AND removido = false",
      [carroIDPar]
    )
  ).rows;
};

const insertCarros = async (carroREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "INSERT INTO carros (cliente_id, modelo, placa) " +
        "VALUES ($1, $2, $3)",
        [
          carroREGPar.cliente_id,
          carroREGPar.modelo,
          carroREGPar.placa,
        ]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlCarros|insertCarros] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const updateCarros = async (carroREGPar) => {
  let linhasAfetadas;
  let msg = "ok";

  try {
    const result = await db.query(
      "UPDATE carros SET " +
        "cliente_id = $2, " +
        "modelo = $3, " +
        "placa = $4 " +
        "WHERE id = $1",
      [
        carroREGPar.id,
        carroREGPar.cliente_id,
        carroREGPar.modelo,
        carroREGPar.placa,
      ]
    );
    linhasAfetadas = result.rowCount;
  } catch (error) {
    console.error("Erro ao atualizar carro:", error);
    msg = "[mdlCarros|updateCarros] " + (error.detail || error.message || "Erro desconhecido");
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

const deleteCarros = async (carroREGPar) => {
  let linhasAfetadas;
  let msg = "ok";
  try {
    linhasAfetadas = (
      await db.query(
        "UPDATE carros SET removido = true WHERE id = $1",
        [carroREGPar.id]
      )
    ).rowCount;
  } catch (error) {
    msg = "[mdlCarros|deleteCarros] " + error.detail;
    linhasAfetadas = -1;
  }

  return { msg, linhasAfetadas };
};

module.exports = {
  getAllCarros,
  getCarroByID,
  insertCarros,
  updateCarros,
  deleteCarros,
};
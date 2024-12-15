// const axios = require("axios");

// const getTotalVagas = async (req, res) =>
//   (async () => {
//     const userName = req.session.userName;
//     const token = req.session.token;

//     const resp = await axios.get(process.env.SERVIDOR_DW3Back + "/getTotalVagas", {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`
//       }
    
//     }).catch(error => {
//       if (error.code === "ECONNREFUSED") {
//         remoteMSG = "Servidor indisponível"

//       } else if (error.code === "ERR_BAD_REQUEST") {
//         remoteMSG = "Usuário não autenticado";

//       } else {
//         remoteMSG = error;
//       }
//       res.render("home/view/index.njk", {
//         vagas: response.data,
//         erro: remoteMSG,
//         userName: userName,
//       });
//     });

//     if (!resp) {
//       return;
//     }
//     res.render("home/view/index.njk", {
//       data: resp.data.registro,
//       totalVagas: response.data,
//       erro: null,
//       userName: userName,
//     });
//   })();

// module.exports = {
//   getTotalVagas
// };

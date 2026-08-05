const express = require("express");
 
const app = express();
 
app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});
 
app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
****************+
Cómo ejecutar el servidor con index.js
 
Simplemente ejecutas:
 
node index.js
debe salir el mensaje que el servidor esta corriendo 
luego vamos a la pagina eb a nuestro host local y verificamos
 
http://localhost:3000
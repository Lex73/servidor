const jwt = require("jsonwebtoken");

module.exports = function(req, res, next){
    //Leer token
    const token = req.header('x-auth-token');

    //Revisar si no hay
    if(!token){
        res.status(401).json({
            msg: "Error de autenticación",
            error: "No Token"
          });
    }

    //Validar Token
    try{
        const cifrado = jwt.verify(token, process.env.SECRETA);
        req.usuario = cifrado.usuario;
        next();

    } catch(error){
        res.status(401).json({
            msg: "Se ha producido un error",
            error: error
          });
    }

}
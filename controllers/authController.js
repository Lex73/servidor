const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");


//Autentica el usuario
exports.autenticarUsuario = async (req, res) => {
  //Reviso si hay errores
  //const errors = validationResult(req);

  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errores: errors.array() });
  // }

  //Estraemos los campos
  const { email, password } = req.body;

  try {
    //Revisar que el usuario sea registrado
    let usuario = await Usuario.findOne({ email });

    if (!usuario) {
      //Si no existe lo comunico y salgo
      return res.status(401).json({ msg: "El Usuario NO existe." });
    }

    //Revisar password
    const passCorrecto = await bcryptjs.compare(password, usuario.password);

    if (!passCorrecto) {
      //Si no existe lo comunico y salgo
      return res.status(401).json({ msg: "El Password no es correcto." });
    }

    //Si e login es correcto
    //Creamos el JWT
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };

    // Y Lo firmamos
    jwt.sign(
      payload,
      process.env.SECRETA,
      {
        expiresIn: 3600, //En segundos es una hora
      },
      (error, token) => {
        if (error) throw error;

        //Mensaje de confirmación
        res.json({
          msg: "Usuario logueado correctamente",
          token: token,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Se ha producido un error",
      error: error,
    });
  }
};


//Obtiene el user autenticado
exports.usuarioAutenticado = async (req, res) => {
  try{
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    res.json(usuario);

  }catch(error){
    console.log(error);
    res.status(500).json({
      msg: "Se ha producido un error",
      error: error,
    });
  }
};

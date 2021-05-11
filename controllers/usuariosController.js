const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.crearUsuario = async (req, res) => {
  //Reviso si hay errores
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  //Extraemos los campos
  const { email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email }); //Verifico en mongoDB si el usuario existe

    if (usuario) {
      //Si existe lo comunico y salgo
      return res.status(400).json({ msg: "El Usuario ya existe." });
    }

    //Crea el nuevo usuario
    usuario = new Usuario(req.body); //En el body del req viene la informacion a insertar.

    //Hasheo el password
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(password, salt);

    //Lo guardo
    await usuario.save();

    //Creamos el JWT
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };

    //Lo firmamos
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
          msg: "Usuario creado correctamente",
          token: token,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hubo un error",
      error: error
    });
  }
};

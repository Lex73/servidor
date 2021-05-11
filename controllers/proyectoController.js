const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

//Crear proyectos
exports.crearProyecto = async (req, res) => {

  //Reviso si hay errores
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  try {
    //Creamos un nuevo proyecto
    const proyecto = new Proyecto(req.body);
    //Guardamos el creado via jwt
    proyecto.creador = req.usuario.id;

    //y despues guardamos el proyecto
    await proyecto.save();
    res.json(proyecto);


  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Se ha producido un error",
      error: error
    });
  }
};

//Listar proyectos por usuario
exports.obtenerProyectos = async (req, res) => {

  try {
    
    const proyectos = await Proyecto.find({creador: req.usuario.id}).sort({creado: -1});
    res.json({proyectos});

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Se ha producido un error",
      error: error
    });
  }
};

//Actualiza un proyecto
exports.actualizaProyecto = async (req, res) => {

  //Reviso si hay errores
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  const {nombre} = req.body;
  const nuevoProyecto = {};

  if(nombre){
    nuevoProyecto.nombre = nombre;
  }

  try {
    
    //Revisar el id
    let proyecto = await Proyecto.findById(req.params.id);

    //Revisar si existe ep proyecto
    if(!proyecto){
      return res.status(404).json({
        msg: "Se ha producido un error",
        error: "El proyecto NO encontrado"
      });
    };

    //verificar el creador del proyecto
    if(proyecto.creador.toString() !== req.usuario.id){
      return res.status(500).json({
        msg: "Se ha producido un error",
        error: "Usuario NO autorizado"
      });
    };

    //Actualizar
    proyecto = await Proyecto.findByIdAndUpdate(
        {_id: req.params.id},
        { $set: nuevoProyecto},
        { new: true}
    );

    res.json({proyecto});

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Se ha producido un error",
      error: error
    });
  }
};

//Eliminar un proyecto
exports.eliminarProyecto = async (req, res) => {

  try {
    
    //Revisar el id
    let proyecto = await Proyecto.findById(req.params.id);

    //Revisar si existe ep proyecto
    if(!proyecto){
      return res.status(404).json({
        msg: "Se ha producido un error",
        error: "El proyecto NO encontrado"
      });
    };

    //verificar el creador del proyecto
    if(proyecto.creador.toString() !== req.usuario.id){
      return res.status(500).json({
        msg: "Se ha producido un error",
        error: "Usuario NO autorizado"
      });
    };

    //Actualizar
    proyecto = await Proyecto.findOneAndRemove({_id: req.params.id});

    res.json({ msg: "Proyecto Eliminado"});

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Se ha producido un error",
      error: error
    });
  }
};
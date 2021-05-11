const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

//Crear tareas
exports.crearTarea = async (req, res) => {
  //Reviso si hay errores
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  try {
    //Extraemos el proyecto
    const { proyecto } = req.body;

    //Revisar si el proyecto existe
    const existeProyecto = await Proyecto.findById({ _id: proyecto });

    if (!existeProyecto) {
      return res.status(404).json({
        msg: "Se ha producido un error",
        error: "Proyecto NO encontrado",
      });
    }

    //verificar el creador del proyecto
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({
        msg: "Se ha producido un error",
        error: "Usuario NO autorizado",
      });
    }

    //Creamos una nueva tarea
    const tarea = new Tarea(req.body);

    //y despues guardamos el proyecto
    await tarea.save();
    res.json(tarea);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Se ha producido un error",
      error: error,
    });
  }
};

//Obtener tareas por proyecto
exports.obtenerTareas = async (req, res) => {
  try {
    //Extraemos el proyecto
    const { proyecto } = req.query;

    //Revisar si el proyecto existe
    const existeProyecto = await Proyecto.findById({ _id: proyecto }).sort({creado: -1});

    if (!existeProyecto) {
      return res.status(404).json({
        msg: "Se ha producido un error",
        error: "Proyecto NO encontrado",
      });
    }

    //verificar el creador del proyecto
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({
        msg: "Se ha producido un error",
        error: "Usuario NO autorizado",
      });
    }

    //Obtener tareas por proyecto
    const tareas = await Tarea.find({ proyecto });
    res.json({ tareas });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Se ha producido un error",
      error: error,
    });
  }
};

//Actualiza una tarea
exports.actualizaTarea = async (req, res) => {
  //Reviso si hay errores
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  try {
    //Extraemos el proyecto
    const { proyecto,nombre,estado } = req.body;

    //Revisar si la tarea existe
    let tareaExiste = await Tarea.findById(req.params.id);

    if (!tareaExiste) {
        return res.status(404).json({
          msg: "Se ha producido un error",
          error: "Tarea NO encontrado",
        });
    };

    const existeProyecto = await Proyecto.findById({ _id: proyecto });

    //verificar el creador del proyecto
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({
        msg: "Se ha producido un error",
        error: "Usuario NO autorizado",
      });
    };

    const nuevaTarea = {};

    nuevaTarea.nombre = nombre;
    nuevaTarea.estado = estado;


    //Guardar la tarea actualizada
    tareaExiste = await Tarea.findOneAndUpdate({_id:req.params.id },nuevaTarea,{new: true} );

    res.json({tareaExiste});

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Se ha producido un error",
      error: error,
    });
  }
};

//Eliminar una tarea
exports.eliminarTarea = async (req, res) => {

  try {
    
    //Extraemos el proyecto
    const { proyecto } = req.query;

    //Revisar el id
    let tarea = await Tarea.findById(req.params.id);

    //Revisar si existe ep proyecto
    if(!tarea){
      return res.status(404).json({
        msg: "Se ha producido un error",
        error: "Tarea NO encontrado"
      });
    };

    const existeProyecto = await Proyecto.findById(proyecto);

    //verificar el creador del proyecto
    if(existeProyecto.creador.toString() !== req.usuario.id){
      return res.status(500).json({
        msg: "Se ha producido un error",
        error: "Usuario NO autorizado"
      });
    };

    //Eliminar
    await Tarea.findOneAndRemove({_id: req.params.id});

    res.json({ msg: "Tarea Eliminado"});

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Se ha producido un error",
      error: error
    });
  }
};
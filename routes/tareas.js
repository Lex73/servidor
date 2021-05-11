//Rutas para tareas
const express = require('express');
const router = express.Router();
const {check} = require ('express-validator');
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');

//api/tarea
//Crear tarea
router.post('/',
        auth,
        [
            check('nombre','El nombre es Obligatorio').not().isEmpty(), //Revisa que el campo NO sea vacio y define el msg que se devuelve en caso de q lo este
            check('proyecto','El proyecto es Obligatorio').not().isEmpty(),
        ],
        tareaController.crearTarea
);

//Obtener tareas por proyecto
router.get('/',
        auth,
        tareaController.obtenerTareas
);

//Actualiza un tareas por Id
router.put('/:id',
        auth,
        tareaController.actualizaTarea
);

//Eliminar una tarea por Id
router.delete('/:id',
        auth,
        tareaController.eliminarTarea
);


module.exports = router;
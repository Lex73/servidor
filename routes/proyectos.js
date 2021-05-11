//Rutas para proyectos
const express = require('express');
const router = express.Router();
const {check} = require ('express-validator');
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');

//api/proyectos
//Crear proyectos
router.post('/',
        auth,
        [
            check('nombre','El nombre es Obligatorio').not().isEmpty(), //Revisa que el campo NO sea vacio y define el msg que se devuelve en caso de q lo este
        ],
        proyectoController.crearProyecto
);

//Lista los proyectos del user
router.get('/',
        auth,
        proyectoController.obtenerProyectos
);

//Actualiza un proyecto por Id
router.put('/:id',
        auth,
        [
            check('nombre','El nombre es Obligatorio').not().isEmpty(), //Revisa que el campo NO sea vacio y define el msg que se devuelve en caso de q lo este
        ],
        proyectoController.actualizaProyecto
);

//Eliminar un proyecto por Id
router.delete('/:id',
        auth,
        proyectoController.eliminarProyecto
);

module.exports = router;
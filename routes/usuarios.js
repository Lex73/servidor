//Rutas para usuarios
const express = require('express');
const router = express.Router();
const {check} = require ('express-validator');
const usuarioController = require('../controllers/usuariosController');

//Crear Usuario
//Api/Usuarios
router.post('/',
        [
            check('nombre','El nombre es Obligatorio').not().isEmpty(), //Revisa que el campo NO sea vacio y define el msg que se devuelve en caso de q lo este
            check('email','Agrega un email valido').isEmail(), //Verifica que sea un email valido
            check('password','El password debe ser minimo de 6 caracteres.').isLength({min:6}) //verifica que tenga minimo 6 carateres.
        ],
        usuarioController.crearUsuario );

module.exports = router;
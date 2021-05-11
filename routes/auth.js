//Rutas para autenticar
const express = require('express');
const router = express.Router();
const {check} = require ('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

//Iniciar sesion
//Api/auth
router.post('/',
        authController.autenticarUsuario
);

//Obtiene el user Autenticado
router.get('/',
        auth,
        authController.usuarioAutenticado
);
module.exports = router;
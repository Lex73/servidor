const mongoose = require('mongoose');

const TareaSchema = mongoose.Schema({
    nombre:{
        type:String,
        required:true,
        trim:true
    },
    estado:{
        type:Boolean,
        default:false
    },
    proyecto:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Proyecto' //Forma de relacionar tablas... el ID y el modelo referido
    },
    creado:{
        type:Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Tarea', TareaSchema);
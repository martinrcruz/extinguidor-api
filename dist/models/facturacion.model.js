"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Facturacion = void 0;
const mongoose_1 = require("mongoose");
const facturacionSchema = new mongoose_1.Schema({
    createdDate: {
        type: Date,
    },
    facturacion: {
        type: Number,
        default: 0
    },
    // Actualizamos la referencia para que apunte al modelo RutaN
    ruta: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Ruta',
    },
    // Se asume que el modelo Parte posee un campo 'name'
    parte: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Parte',
    },
});
// Middleware para asignar la fecha de creación
facturacionSchema.pre('save', function () {
    this.createdDate = new Date();
});
// Configuración para transformar la salida JSON y eliminar _id y __v
facturacionSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret.__v;
        return ret;
    }
});
exports.Facturacion = (0, mongoose_1.model)('Facturacion', facturacionSchema);

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
    ruta: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Ruta',
    },
    parte: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Parte',
    },
});
facturacionSchema.pre('save', function () {
    this.createdDate = new Date();
});
exports.Facturacion = (0, mongoose_1.model)('Facturacion', facturacionSchema);

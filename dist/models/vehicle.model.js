"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vehicle = void 0;
const mongoose_1 = require("mongoose");
const vehicleSchema = new mongoose_1.Schema({
    fuel: {
        type: String,
        enum: ["Diesel", "Gasolina"],
    },
    type: {
        type: String,
        enum: ["Furgon", "Turismo"]
    },
    modelo: {
        type: String,
        required: [true, '']
    },
    brand: {
        type: String,
        required: [true, '']
    },
    photo: {
        type: String,
        required: [false, ''],
        default: 'auto.jpg'
    },
    matricula: {
        type: String,
        required: [true, '']
    },
    createdDate: {
        type: Date,
    },
});
vehicleSchema.pre('save', function () {
    this.createdDate = new Date();
});
exports.Vehicle = (0, mongoose_1.model)('Vehicle', vehicleSchema);

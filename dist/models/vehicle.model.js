"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vehicle = void 0;
const mongoose_1 = require("mongoose");
const vehicleSchema = new mongoose_1.Schema({
    fuel: {
        type: String,
        enum: ["Diesel", "Gasolina"],
    },
    tipe: {
        type: String,
        enum: ["Furgon", "Turismo"]
    },
    model: {
        type: String,
        required: [true, '']
    },
    brand: {
        type: String,
        required: [true, '']
    },
    photo: {
        type: String,
        required: [true, ''],
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

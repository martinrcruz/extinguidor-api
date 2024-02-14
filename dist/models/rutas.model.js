"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ruta = void 0;
const mongoose_1 = require("mongoose");
const rutasSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        unique: true
    },
    date: {
        type: Date,
    },
    users: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Users',
            required: [true, 'no se encontro usuario']
        }],
    vehicle: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: [true, 'no se encontro vehiculo']
    }
});
exports.Ruta = (0, mongoose_1.model)('Ruta', rutasSchema);

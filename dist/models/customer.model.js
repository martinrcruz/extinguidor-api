"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
const mongoose_1 = require("mongoose");
const customerSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    active: {
        type: Boolean,
        default: true
    },
    zone: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Zone',
        required: [true, 'La zona es obligatoria']
    },
    address: {
        type: String,
        required: [true, 'La dirección es obligatoria'],
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});
exports.Customer = mongoose_1.models.Customer || (0, mongoose_1.model)('Customer', customerSchema);

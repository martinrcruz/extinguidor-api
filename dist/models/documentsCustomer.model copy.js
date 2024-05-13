"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentCustomer = void 0;
const mongoose_1 = require("mongoose");
const documentCustomerSchema = new mongoose_1.Schema({
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Customer',
        required: [true, 'no se encontro usuario']
    },
    name: {
        type: String,
        required: [true, 'el nombre es requerido']
    },
    url: {
        type: String,
        required: [true, 'el nombre es requerido']
    },
    date: {
        type: Date,
        required: [true, 'la fecha es requerida']
    },
});
exports.DocumentCustomer = (0, mongoose_1.model)('DocumentCustomer', documentCustomerSchema);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
const mongoose_1 = require("mongoose");
const customerSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, ""],
    },
    email: {
        type: String,
        required: [true, ""],
    },
    nifCif: {
        type: String,
        required: [true, ""],
    },
    address: {
        type: String,
        required: [true, "name is required"],
    },
    state: {
        type: String,
        required: [true, "name is required"],
    },
    phone: {
        type: String,
        required: [true, "name is required"],
    },
    externalId: {
        type: String,
        required: [true, "name is required"],
    },
    contactName: {
        type: String,
        required: [true, "name is required"],
    },
    company: {
        type: String,
        required: [true, "name is required"],
    },
    description: {
        type: String,
        required: [true, "name is required"],
    },
    codezip: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Zipcode',
        required: [true, '']
    },
    photo: {
        type: String,
        required: [true, ""],
        default: 'foto.jpg'
    },
    createdAt: {
        type: Date,
        required: [true, ""],
    }
});
customerSchema.pre('save', function () {
    this.createdAt = new Date();
});
exports.Customer = (0, mongoose_1.model)('Customer', customerSchema);

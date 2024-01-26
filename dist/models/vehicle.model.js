"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vehicle = void 0;
const mongoose_1 = require("mongoose");
const vehicleSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'title is required']
    },
    code: {
        type: String,
        unique: true,
        required: [true, '']
    },
    description: {
        type: String,
    },
    vehiclemodel: {
        type: String,
        required: [true, '']
    },
    vehicleBrand: {
        type: String,
        required: [true, '']
    },
    photo: {
        type: String,
        required: [true, ''],
        default: 'auto.jpg'
    },
    registrationNumber: {
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

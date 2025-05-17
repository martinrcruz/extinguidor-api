"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = void 0;
const mongoose_1 = require("mongoose");
const contractSchema = new mongoose_1.Schema({
    code: {
        type: String,
        required: [true, 'code is required'],
        unique: true
    },
    customerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'customers',
        required: [true, 'customer is required'],
    },
    startDate: {
        type: Date,
        required: [true, "start date is required"]
    },
    endDate: {
        type: Date,
        required: [true, "end date is required"]
    },
    type: {
        type: String,
        enum: ['F', 'E', 'R', 'C'],
        required: [true, "end date is required"]
    },
    contractSystems: [{
            system: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'systems',
                required: ['system is required']
            },
            contractSubsystems: [{
                    subsystem: {
                        type: mongoose_1.Schema.Types.ObjectId,
                        ref: 'subsystems',
                        required: ['subsystem is required']
                    },
                    name: {
                        type: String,
                        required: ['specific subsystem name is required']
                    },
                    instalationDate: {
                        type: Date,
                        required: [true, "instalation date is required"]
                    },
                    expiry: {
                        type: Date,
                        required: [true, "expiry date is required"]
                    },
                    comments: String,
                    photoUrl: String,
                    article: {
                        type: mongoose_1.Schema.Types.ObjectId,
                        ref: 'materials'
                    },
                }]
        }],
    averageTime: {
        type: Number, // minutes
    },
    delegation: {
        type: String,
    },
    name: {
        type: String,
    },
    revisionFrequency: {
        type: String,
        enum: ['T', 'S', 'A']
    },
    address: String,
    zone: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'zones'
    },
    lastRevision: {
        report: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'reports'
        },
        date: Date
    },
    rate: {
        type: String,
        enum: ['T', 'S', 'A']
    },
    total: Number,
    documents: [{
            name: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }],
});
exports.Contract = (0, mongoose_1.model)('Contract', contractSchema);

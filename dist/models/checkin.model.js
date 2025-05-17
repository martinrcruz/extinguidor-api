"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Checkin = void 0;
const mongoose_1 = require("mongoose");
const checkinSchema = new mongoose_1.Schema({
    checkin: {
        startTime: {
            type: Number,
            required: [true, 'checkin-startTime is required']
        },
        ubication: {
            lat: { type: Number },
            long: { type: Number }
        },
    },
    checkout: {
        startTime: {
            type: Number,
        },
        ubication: {
            lat: { type: Number },
            long: { type: Number }
        },
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'userId is required']
    },
    reportId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'reports',
        required: [true, 'reportId is required']
    }
});
exports.Checkin = (0, mongoose_1.model)('Checkin', checkinSchema);

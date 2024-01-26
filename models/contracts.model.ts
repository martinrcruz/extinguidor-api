import { Schema, model, Document } from 'mongoose';

const contractSchema = new Schema({

    code: {
        type: String,
        required: [true, 'code is required'],
        unique: true
    },
    customerId: {
        type: Schema.Types.ObjectId,
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
            type: Schema.Types.ObjectId,
            ref: 'systems',
            required: ['system is required']
        },
        contractSubsystems:[{
            subsystem: {
                type: Schema.Types.ObjectId,
                ref: 'subsystems',
                required: ['subsystem is required']
            },
            name:{
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
                type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId,
        ref: 'zones'
    },
    lastRevision: {
        report: {
            type: Schema.Types.ObjectId,
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


export interface IContract extends Document {
    code: string;
    customerId:string;
    startDate: Date;
    endDate: Date;
    type: string;
    contractSystems: [{
        system: string;
        contractSubsystems:[{
            subsystem: string;
            name:string;
            instalationDate: Date;
            expiry:  Date;
            comments: string;
            photoUrl: string;
            article: string;
        }]
    }],
    averageTime: number; // minutes
    delegation: string;
    name: string;
    revisionFrequency: string;
    address: string;
    lastRevision: string;
    date: Date;

    rate: string;
    total: number,
    documents: [{
        name: string;
        url: string,
    }],
    
}

export const Contract = model<IContract>('Contract', contractSchema);
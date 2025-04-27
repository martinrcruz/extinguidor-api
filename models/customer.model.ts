import { Schema, model, Document, models } from 'mongoose';

const customerSchema = new Schema({
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
        type: Schema.Types.ObjectId,
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

export interface ICustomer extends Document {
    name: string;
    active: boolean;
    zone: string;
    address: string;
    phone?: string;
    email?: string;
    createdDate: Date;
}

export const Customer = models.Customer || model<ICustomer>('Customer', customerSchema); 
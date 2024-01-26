import { Schema, model, Document } from 'mongoose';

const customerSchema = new Schema({
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
        type: Schema.Types.ObjectId,
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

customerSchema.pre('save', function(){
    this.createdAt = new Date();
})

export interface ICustomer extends Document {
    name: string,
    email: string,
    nifCif: string,
    address: string,
    state: string,
    phone: string,
    externalId: string,
    contactName: string,
    company: string,
    description: string,
    photo: string,
    codezip: string;
    createdAt: Date

}

export const Customer = model<ICustomer>('Customer', customerSchema);
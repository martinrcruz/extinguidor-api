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
    zone: {
        type: Schema.Types.ObjectId,
        ref: 'Zone',
    },
    phone: {
        type: String,
        required: [true, "name is required"],
    },
   
    contactName: {
        type: String,
        required: [true, "name is required"],
    },
    code: {
        type: String,
        required: [true, "name is required"],
    },
    description: {
        type: String,
    },
    photo: {
        type: String,
        required: [true, ""],
        default: 'foto.jpg'
    },
    createdAt: {
        type: Date,
        
    }

});

customerSchema.pre('save', function(){
    this.createdAt = new Date();
})

export interface ICustomer extends Document {
    code: string;
    name: string;
    email: string;
    nifCif: string;
    address: string;
    contactName: string;
    zone: string;
    phone: string;
    description: string;
    photo: string;
    createdAt: Date;

}

export const Customer = model<ICustomer>('Customer', customerSchema);
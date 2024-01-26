import { Schema, model, Document } from 'mongoose';

const documentCustomerSchema = new Schema({

    customer: {
        type: Schema.Types.ObjectId,
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

export interface IDocumentCustomer extends Document {
    user:       string;
    name:       string;
    url:        string;
    date:       Date;
        
  }
  
  export const DocumentCustomer = model<IDocumentCustomer>('DocumentCustomer', documentCustomerSchema);
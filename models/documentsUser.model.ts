import { Schema, model, Document } from 'mongoose';

const documentUserSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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

export interface IDocumentUser extends Document {
    user:       string;
    name:       string;
    url:        string;
    date:       Date;
        
  }
  
  export const DocumentUser = model<IDocumentUser>('DocumentUser', documentUserSchema);
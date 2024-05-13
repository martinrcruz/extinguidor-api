import { Schema, model, Document } from 'mongoose';

const documentParteSchema = new Schema({

    parte: {
        type: Schema.Types.ObjectId,
        ref: 'Parte',
        required: [true, 'no se encontro parte']       
    },
    name: {
        type: String,
        required: [true, 'el nombre es requerido']
    },
    url: {
        type: String,
        required: [true, 'el nombre es requerido']
    },
    


});

export interface IDocumentParte extends Document {
    parte:       string;
    name:       string;
    url:        string;
    
        
  }
  
  export const DocumentParte = model<IDocumentParte>('DocumentParte', documentParteSchema);
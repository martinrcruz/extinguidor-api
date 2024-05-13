import { Schema, model, Document } from 'mongoose';


const materialParteSchema = new Schema({
    ruta: {
        type: Schema.Types.ObjectId,
        ref: 'Ruta',
        required: [true, 'no se encontro parte']       
    },
    material: {
        type: Schema.Types.ObjectId,
        ref: 'Material',
        required: [true, 'no se encontro parte']       
    },
    cantidad: {
        type: String,
        required: [true, "code is required"],
        unique: true
    },

});

export interface IMaterialParte extends Document {
   
    
 
    ruta:           string;
    material:           string;
    cantidad:    string;
        
  }
  
  export const MaterialParte = model<IMaterialParte>('MaterialParte', materialParteSchema);


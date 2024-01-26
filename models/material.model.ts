import { Schema, model, Document } from 'mongoose';


const materialSchema = new Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        unique: true
    },
    code: {
        type: String,
        required: [true, "code is required"],
        unique: true
    },
    description: {
        type: String
    },
    type: {
        type: String
    }
});

export interface IMaterial extends Document {
   
    name:           string;
    code:           string;
    description:    string;
    type:           string;
 
        
  }
  
  export const Material = model<IMaterial>('Material', materialSchema);


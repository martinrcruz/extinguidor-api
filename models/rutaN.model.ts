import { Schema, model, Document } from 'mongoose';

const rutaNSchema = new Schema({

    name: {
        type: String,
        required: [true, 'name is required'],
        unique: true
    },
    
});


export interface IRutaN extends Document {
    name: string;
   
    
}


export const RutaN = model<IRutaN>('RutaN', rutaNSchema);
import { Schema, model, Document } from 'mongoose';

const rutasSchema = new Schema({

    name: {
        type: String,
        required: [true, 'name is required'],
        unique: true
    },
    date: {
        type: Date,
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'no se encontro usuario'] 
    }],
    vehicle: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: [true, 'no se encontro vehiculo'] 
    }

});


export interface IRuta extends Document {
    name: string;
    date: Date;
    vehicle: string;
    user:[];
    
}


export const Ruta = model<IRuta>('Ruta', rutasSchema);
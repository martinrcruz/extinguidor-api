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
    }],
    vehicle: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle', 
    }

});


export interface IRuta extends Document {
    name: string;
    date: Date;
    vehicle: string;
    user:[];
    
}


export const Ruta = model<IRuta>('Ruta', rutasSchema);
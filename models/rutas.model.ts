import { Schema, model, Document } from 'mongoose';

const rutasSchema = new Schema({

    name: {
        type: String,
        required: [true, 'name is required'],
        unique: true
    },
    state: {
        type: String,
        enum:["Pendiente", "EnProceso","Finalizado"],
        required:[true,''],
        default:"Pendiente"
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
    state: string;
    date: Date;
    vehicle: string;
    users:[];
    
}


export const Ruta = model<IRuta>('Ruta', rutasSchema);
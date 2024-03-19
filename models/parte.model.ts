import { Schema, model, Document } from 'mongoose';

const parteSchema = new Schema({

    description: {
        type: String,
        required: [true, 'name is required'],
        
    },
    state: {
        type: String,
        enum:["Pendiente", "EnProceso","Finalizado"],
        required:[true,''],
        default:"Pendiente"
    },
    type: {
        type: String,
        enum:["Instalacion", "Mantenimiento","Reparacion"],
        required:[true,''],
       
    },
    asignado:{
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
    },
    code: {
        type: String,
       // required: [true, 'code is required'],
       // unique: true
    },
    zone: {
        type: Schema.Types.ObjectId,
        ref: 'Zone',
        required: [true, '']    
    },
    ruta: {
        type: Schema.Types.ObjectId,
        ref: 'Ruta',
        
          
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: [true, '']    
    }

});


export interface IParte extends Document {
   
    code: string;
    zone: string;
    customer: string;
    ruta: string;
    date: Date;
    asignado: boolean;
    type: string;
    state:  string; 
    description: string;
    
}

export const Parte = model<IParte>('Parte', parteSchema);
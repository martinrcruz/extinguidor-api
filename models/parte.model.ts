import { Schema, model, Document } from 'mongoose';

const parteSchema = new Schema({

    description: {
        type: String,
        required: [true, 'name is required'],
        
    },
    facturacion: {
        type: Number, 
        default:0       
    },
    state: {
        type: String,
        enum:["Baja","Pendiente", "EnProceso","Finalizado"],
        required:[true,''],
        default:"Pendiente"
    },
    type: {
        type: String,
        enum:["Obra", "Mantenimiento","Correctivo","Visitas"],
        required:[true,''],
       
    },
    categoria: {
        type: String,
        enum:["Extintores", "Incendio","Robo","CCTV","Pasiva"],
        required:[true,''],
    },
    asignado:{
        type: Boolean,
        default: false
    },
    periodicos:{
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
    },
    createdDate: {
        type: Date,
    },
    eliminado:{
        type: Boolean,
        default: false
    }

});
parteSchema.pre('save', function(){
    this.createdDate = new Date();
})


export interface IParte extends Document {
   
    code: string;
    zone: string;
    customer: string;
    ruta: string;
    date: Date;
    asignado: boolean;
    periodicos: boolean;
    type: string;
    categoria: string;
    state:  string; 
    description: string;
    facturacion: number;
    createdDate: Date;
    eliminado: boolean;

    
}

export const Parte = model<IParte>('Parte', parteSchema);
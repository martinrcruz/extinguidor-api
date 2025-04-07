import { Schema, model, Document } from 'mongoose';

const rutasSchema = new Schema({
    name: {
        type: Schema.Types.ObjectId,
        ref: 'RutaN',
        required: [true, '']
    },
    state: {
        type: String,
        enum:["Pendiente", "EnProceso","Finalizado"],
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
        default: null
    },
    eliminado: {
        type: Boolean,
        default: false
    },
    // NUEVOS CAMPOS
    comentarios: {
        type: String,
        default: ''
    },
    encargado: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false // si es obligatorio en la lógica, lo controlas en endpoint
    },
    herramientas: [{
        type: String // o array de ObjectId si lo gestionas en otra coleccion
    }]
});

export interface IRuta extends Document {
    name: string;
    state: string;
    date: Date;
    vehicle?: string;
    users?: string[];
    eliminado: boolean;

    comentarios: string;
    encargado?: string;
    herramientas?: string[];
}

export const Ruta = model<IRuta>('Ruta', rutasSchema);

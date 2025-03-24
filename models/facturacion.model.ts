import { Schema, model, Document } from 'mongoose';

const facturacionSchema = new Schema({
    createdDate: {
        type: Date,
    },
    facturacion: {
        type: Number,
        default: 0
    },
    // Actualizamos la referencia para que apunte al modelo RutaN
    ruta: {
        type: Schema.Types.ObjectId,
        ref: 'Ruta',
    },
    // Se asume que el modelo Parte posee un campo 'name'
    parte: {
        type: Schema.Types.ObjectId,
        ref: 'Parte',
    },
});

// Middleware para asignar la fecha de creación
facturacionSchema.pre('save', function() {
    this.createdDate = new Date();
});

// Configuración para transformar la salida JSON y eliminar _id y __v
facturacionSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.__v;
        delete ret._id;
        return ret;
    }
});

export interface IFacturacion extends Document {
    facturacion: number;
    ruta: string;
    parte: string;
}

export const Facturacion = model<IFacturacion>('Facturacion', facturacionSchema);

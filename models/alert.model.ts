import { Schema, model, Document } from 'mongoose';

/**
 * Interfaz que define los campos de nuestra alerta,
 * reflejando la estructura en la base de datos.
 */
export interface IAlert extends Document {
    message: string;       // Texto o descripción de la alerta
    state: 'Pendiente' | 'Cerrado'; // Estado de la alerta
    createdDate: Date;     // Fecha de creación
}

/**
 * Esquema de Mongoose para la colección "Alert"
 */
const alertSchema = new Schema<IAlert>({
    message: {
        type: String,
        required: [true, 'El campo "message" es obligatorio']
    },
    state: {
        type: String,
        enum: ['Pendiente', 'Cerrado'],
        default: 'Pendiente'
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

/**
 * Exportamos el modelo "Alert", basado en alertSchema.
 */
export const Alert = model<IAlert>('Alert', alertSchema);

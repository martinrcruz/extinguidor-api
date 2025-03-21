import { Schema, model, Document } from 'mongoose';

export interface IHerramienta extends Document {
    name: string;
    description: string;
    // Puedes agregar más campos según las reglas de negocio, por ejemplo:
    // stock?: number;
    // category?: string;
}

const herramientaSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la herramienta es requerido'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        trim: true,
    },
    // Otros campos y validaciones según tus reglas de negocio se pueden agregar aquí
}, {
    timestamps: true
});

export const Herramienta = model<IHerramienta>('Herramienta', herramientaSchema);

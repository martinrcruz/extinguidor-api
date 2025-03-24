import { Schema, model, Document } from 'mongoose';

const parteSchema = new Schema({
    description: {
        type: String,
        required: [true, 'Descripción es requerida']
    },
    facturacion: {
        type: Number,
        default: 0
    },
    state: {
        type: String,
        enum: ['Pendiente', 'EnProceso', 'Finalizado'],
        default: 'Pendiente'
    },
    type: {
        type: String,
        enum: ['Obra', 'Mantenimiento', 'Correctivo', 'Visitas'],
        default: 'Mantenimiento'
    },
    categoria: {
        type: String,
        enum: ['Extintores', 'Incendio', 'Robo', 'CCTV', 'Pasiva'],
        default: 'Extintores'
    },
    asignado: {
        type: Boolean,
        default: false
    },
    /**
     * Forzaremos day=1 al guardarlo (vía la ruta) para simular mes/año.
     */
    date: {
        type: Date,
        required: [true, 'Fecha es requerida']
    },
    /**
     * Apunta al modelo unificado "Customer".
     */
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: [true, 'El cliente es requerido']
    },
    /**
     * Ruta (opcional).
     */
    ruta: {
        type: Schema.Types.ObjectId,
        ref: 'Ruta',
        default: null
    },
    /**
     * Campos para partes periódicos:
     */
    periodico: {
        type: Boolean,
        default: false
    },
    frequency: {
        type: String,
        enum: ['Mensual', 'Trimestral', 'Semestral', 'Anual']
    },
    endDate: {
        type: Date
    },
    createdDate: {
        type: Date
    }
});

parteSchema.pre('save', function() {
    if (!this.createdDate) {
        this.createdDate = new Date();
    }
});

export interface IParte extends Document {
    description: string;
    facturacion: number;
    state: string;
    type: string;
    categoria: string;
    asignado: boolean;
    date: Date;       // day=1 for month-year
    customer: string; // Apunta a Customer
    ruta?: string;
    periodico: boolean;
    frequency?: string;
    endDate?: Date;
    createdDate?: Date;
}

export const Parte = model<IParte>('Parte', parteSchema);

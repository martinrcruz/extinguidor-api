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
        enum: ['Extintores', 'Incendio', 'Robo', 'CCTV', 'Pasiva', 'Venta'],
        default: 'Extintores'
    },
    asignado: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        required: [true, 'Fecha es requerida']
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: [true, 'El cliente es requerido']
    },
    ruta: {
        type: Schema.Types.ObjectId,
        ref: 'Ruta',
        default: null
    },
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
    // NUEVOS CAMPOS
    coordinationMethod: {
        type: String,
        enum: ['Llamar antes', 'Coordinar por email', 'Coordinar según horarios'],
        default: 'Coordinar según horarios'
    },
    gestiona: {
        type: Number,
        default: 0
    },
    finalizadoTime: {
        type: Date,
        default: null
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
    date: Date;
    customer: string;
    ruta?: string;
    periodico: boolean;
    frequency?: string;
    endDate?: Date;
    coordinationMethod: string;
    gestiona: number;
    finalizadoTime?: Date;
    createdDate?: Date;
}

export const Parte = model<IParte>('Parte', parteSchema);

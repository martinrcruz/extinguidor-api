import { Schema, model, Document } from 'mongoose';

const parteSchema = new Schema({
    title: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true,
        maxlength: [200, 'El título no puede exceder los 200 caracteres']
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        trim: true
    },
    date: {
        type: Date,
        required: [true, 'La fecha es obligatoria'],
        index: true
    },
    state: {
        type: String,
        enum: {
            values: ['Pendiente', 'EnProceso', 'Finalizado'],
            message: '{VALUE} no es un estado válido'
        },
        default: 'Pendiente',
        index: true
    },
    type: {
        type: String,
        enum: {
            values: ['Obra', 'Mantenimiento', 'Correctivo', 'Visitas'],
            message: '{VALUE} no es un tipo válido'
        },
        default: 'Mantenimiento',
        index: true
    },
    categoria: {
        type: String,
        enum: {
            values: ['Extintores', 'Incendio', 'Robo', 'CCTV', 'Pasiva', 'Venta'],
            message: '{VALUE} no es una categoría válida'
        },
        default: 'Extintores',
        index: true
    },
    asignado: {
        type: Boolean,
        default: false,
        index: true
    },
    eliminado: {
        type: Boolean,
        default: false,
        index: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: [true, 'El cliente es obligatorio'],
        index: true
    },
    ruta: {
        type: Schema.Types.ObjectId,
        ref: 'Ruta',
        index: true
    },
    address: {
        type: String,
        required: [true, 'La dirección es obligatoria'],
        trim: true
    },
    periodico: {
        type: Boolean,
        default: false
    },
    frequency: {
        type: String,
        enum: {
            values: ['Mensual', 'Trimestral', 'Semestral', 'Anual'],
            message: '{VALUE} no es una frecuencia válida'
        }
    },
    endDate: {
        type: Date,
        validate: {
            validator: function(this: any, value: Date) {
                return !this.periodico || (this.periodico && value);
            },
            message: 'La fecha de finalización es obligatoria para partes periódicos'
        }
    },
    coordinationMethod: {
        type: String,
        enum: {
            values: ['Llamar antes', 'Coordinar por email', 'Coordinar según horarios'],
            message: '{VALUE} no es un método de coordinación válido'
        },
        default: 'Coordinar según horarios'
    },
    gestiona: {
        type: Number,
        default: 0,
        min: [0, 'El valor de gestión no puede ser negativo'],
        max: [100, 'El valor de gestión no puede exceder 100']
    },
    finalizadoTime: {
        type: Date
    },
    facturacion: {
        type: Number,
        default: 0
    },
    comentarios: [{
        texto: {
            type: String,
            required: [true, 'El texto del comentario es obligatorio'],
            trim: true
        },
        fecha: {
            type: Date,
            default: Date.now
        },
        usuario: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'El usuario es obligatorio']
        }
    }],
    documentos: [{
        nombre: {
            type: String,
            required: [true, 'El nombre del documento es obligatorio'],
            trim: true
        },
        url: {
            type: String,
            required: [true, 'La URL del documento es obligatoria']
        },
        tipo: {
            type: String,
            required: [true, 'El tipo de documento es obligatorio']
        },
        fecha: {
            type: Date,
            default: Date.now
        }
    }],
    articulos: [{
        cantidad: {
            type: Number,
            required: true
        },
        codigo: {
            type: String,
            required: true
        },
        grupo: {
            type: String,
            required: true
        },
        familia: {
            type: String,
            required: true
        },
        descripcionArticulo: {
            type: String,
            required: true
        },
        precioVenta: {
            type: Number,
            required: true
        }
    }],
    createdDate: {
        type: Date,
        default: Date.now
    }
});

// Índices compuestos para búsquedas frecuentes
parteSchema.index({ customer: 1, date: 1 });
parteSchema.index({ ruta: 1, date: 1 });
parteSchema.index({ state: 1, date: 1 });

// Middleware para validar fechas
parteSchema.pre('save', function(next) {
    if (this.periodico && !this.endDate) {
        next(new Error('La fecha de finalización es obligatoria para partes periódicos'));
    }
    if (this.state === 'Finalizado' && !this.finalizadoTime) {
        this.finalizadoTime = new Date();
    }
    next();
});

export interface IParte extends Document {
    title: string;
    description: string;
    date: Date;
    state: 'Pendiente' | 'EnProceso' | 'Finalizado';
    type: 'Obra' | 'Mantenimiento' | 'Correctivo' | 'Visitas';
    categoria: 'Extintores' | 'Incendio' | 'Robo' | 'CCTV' | 'Pasiva' | 'Venta';
    asignado: boolean;
    eliminado: boolean;
    customer: string;
    ruta?: string;
    address: string;
    periodico: boolean;
    frequency?: 'Mensual' | 'Trimestral' | 'Semestral' | 'Anual';
    endDate?: Date;
    coordinationMethod: 'Llamar antes' | 'Coordinar por email' | 'Coordinar según horarios';
    gestiona: number;
    finalizadoTime?: Date;
    facturacion: number;
    comentarios: Array<{
        texto: string;
        fecha: Date;
        usuario: string;
    }>;
    documentos: Array<{
        nombre: string;
        url: string;
        tipo: string;
        fecha: Date;
    }>;
    articulos: Array<{
        cantidad: number;
        codigo: string;
        grupo: string;
        familia: string;
        descripcionArticulo: string;
        precioVenta: number;
    }>;
    createdDate: Date;
}

export const Parte = model<IParte>('Parte', parteSchema);

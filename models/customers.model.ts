import { Schema, model, Document } from 'mongoose';

/**
 * Modelo unificado "Customer" que incluye campos de Customer y Contract.
 */
const customerSchema = new Schema({

    // Campos básicos del Customer
    name: {
        type: String,
        required: [true, "Nombre requerido"],
    },
    email: {
        type: String,
        required: [true, "Email requerido"],
    },
    nifCif: {
        type: String,
        required: [true, "NIF/CIF requerido"],
    },
    address: {
        type: String,
        required: [true, "Dirección requerida"],
    },
    zone: {
        type: Schema.Types.ObjectId,
        ref: 'Zone',
    },
    phone: {
        type: String,
        required: [true, "Teléfono requerido"],
    },
    contactName: {
        type: String,
        required: [true, "Nombre de contacto requerido"],
    },
    code: {
        type: String,
        required: [true, "Code requerido"],
    },
    description: {
        type: String,
    },
    gestiona: {
        type: String,
    },
    photo: {
        type: String,
        default: 'foto.jpg'
    },
    createdAt: {
        type: Date
    },

    // Campos de "Contract" (fusionados)
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    type: {
        type: String,
        enum: ['F', 'E', 'R', 'C'],
    },
    contractSystems: [{
        system: {
            type: Schema.Types.ObjectId,
            ref: 'systems'
        },
        contractSubsystems:[{
            subsystem: {
                type: Schema.Types.ObjectId,
                ref: 'subsystems'
            },
            name: String,
            instalationDate: Date,
            expiry: Date,
            comments: String,
            photoUrl: String,
            article: {
                type: Schema.Types.ObjectId,
                ref: 'materials'
            },
        }]
    }],
    averageTime: {
        type: Number, // minutes
    },
    delegation: {
        type: String,
    },
    revisionFrequency: {
        type: String,
        enum: ['T', 'S', 'A']
    },
    rate: {
        type: String,
        enum: ['T', 'S', 'A']
    },
    // NUEVOS CAMPOS
    MI: {
        type: Number,
        default: 0
    },
    tipo: {
        type: String,
        default: 'Normal' // o 'Especial' etc.
    },
    total: Number,
    documents: [{
        name: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }]

});

customerSchema.pre('save', function(){
    if (!this.createdAt) {
        this.createdAt = new Date();
    }
});

export interface ICustomer extends Document {
    // Campos combinados
    name: string;
    email: string;
    nifCif: string;
    address: string;
    zone: string;
    phone: string;
    contactName: string;
    code: string;
    description?: string;
    gestiona?: string;
    photo: string;
    createdAt: Date;
    MI?: number;
    tipo?: string;
    // "Contract" data
    startDate?: Date;
    endDate?: Date;
    type?: string; // 'F','E','R','C'
    contractSystems?: Array<any>;
    averageTime?: number;
    delegation?: string;
    revisionFrequency?: string;
    rate?: string;
    total?: number;
    documents?: Array<{ name: string; url: string }>;
}

export const Customer = model<ICustomer>('Customer', customerSchema);

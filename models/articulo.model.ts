import { Schema, model, Document } from 'mongoose';

export interface IArticulo extends Document {
  cantidad: number;
  codigo: string;
  grupo: string;
  familia: string;
  descripcionArticulo: string;
  precioVenta: number;
  createdDate: Date;
  updatedDate: Date;
  eliminado: boolean;
}

const articuloSchema = new Schema({
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
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  updatedDate: {
    type: Date,
    default: Date.now
  },
  eliminado: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { 
    createdAt: 'createdDate',
    updatedAt: 'updatedDate'
  }
});

export default model<IArticulo>('Articulo', articuloSchema); 
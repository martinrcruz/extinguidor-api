import { Schema, model, Document } from 'mongoose';

const facturacionSchema = new Schema({


    createdDate: {
        type: Date,
    },
    facturacion: {
        type: Number, 
        default:0       
    },
    ruta: {
        type: Schema.Types.ObjectId,
        ref: 'Ruta',   
    },
    parte: {
        type: Schema.Types.ObjectId,
        ref: 'Parte',   
    },

});
facturacionSchema.pre('save', function(){
    this.createdDate = new Date();
})


export interface IFacturacion extends Document {
    name: string;
    code: string;
    codezip: string;
    
}

export const Facturacion = model<IFacturacion>('Facturacion', facturacionSchema);
import { Schema, model, Document } from 'mongoose';

const vehicleSchema = new Schema({

    fuel: {
        type: String,
        enum:["Diesel", "Gasolina"],
       
    },
    type: {
        type: String,
        enum:["Furgon", "Turismo"]
        
    },
    modelo: {
        type: String,
        required: [true, '']
    },
    brand: {
        type: String,
        required: [true, '']
    },
    photo: {
        type: String,
        required: [true, ''],
        default: 'auto.jpg'
    },
    matricula: {
        type: String,
        required: [true, '']
    },
    createdDate: {
        type: Date,
    },

});

vehicleSchema.pre('save', function(){
    this.createdDate = new Date();
})


export interface IVehicle extends Document {
    fuel: string;
    type: string;
    modelo: string;
    brand: string;
    photo: string;
    matricula: string;
    createdDate: Date;
}

export const Vehicle = model<IVehicle>('Vehicle', vehicleSchema);
import { Schema, model, Document } from 'mongoose';

const vehicleSchema = new Schema({

    title: {
        type: String,
        required: [true, 'title is required']
    },
    code: {
        type: String,
        unique: true,
        required: [true, '']
      },
    description: {
        type: String,
        
    },
    vehiclemodel: {
        type: String,
        required: [true, '']
    },
    vehicleBrand: {
        type: String,
        required: [true, '']
    },
    photo: {
        type: String,
        required: [true, ''],
        default: 'auto.jpg'
    },
    registrationNumber: {
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
    title: string;
    code: string;
    description: string;
    vehiclemodel: string;
    vehicleBrand: string;
    photo: string;
    registrationNumber: string;
    createdDate: Date;
}

export const Vehicle = model<IVehicle>('Vehicle', vehicleSchema);
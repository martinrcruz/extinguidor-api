import { Schema, model, Document } from 'mongoose';

const zipcodeSchema = new Schema({

    name: {
        type: String,
        
    },
    codezip: {
        type: String,
        required: [true, 'Zip Code is required'],
        unique: true
    }

});


export interface IZipcode extends Document {
    zipcode: string;
    codezip: string
    
}

export const Zipcode = model<IZipcode>('Zipcode', zipcodeSchema);
import { Schema, model, Document } from 'mongoose';

const zoneSchema = new Schema({

    name: {
        type: String,
        required: [true, 'name is required'],
        unique: true
    },
    code: {
        type: String,
        required: [true, 'code is required'],
        unique: true
    },
    codezip: {
        type: Schema.Types.ObjectId,
        ref: 'Zipcode',
       // required: [true, '']    
    }

});


export interface IZone extends Document {
    name: string;
    code: string;
    codezip: string;
    
}

export const Zone = model<IZone>('Zone', zoneSchema);
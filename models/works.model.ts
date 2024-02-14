import { Schema, model, Document } from 'mongoose';

const workSchema = new Schema({

    name: {
        type: String,
        required: [true, 'name is required'],
        unique: true
    },
    codezip: {
        type: Schema.Types.ObjectId,
        ref: 'Zipcode',
        required: [true, '']    
    }

});


export interface IWork extends Document {
    name: string;
    codezip: string;
    
}

export const Work = model<IWork>('Zone', workSchema);
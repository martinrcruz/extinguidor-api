import { Schema, model, Document } from 'mongoose';

const anomalySchema = new Schema({

    name: {
        type: String,
        required: [true, 'name is required'],
    },
    materials: [{
            type: Schema.Types.ObjectId,
            ref: 'Solution',
            required: [true, ''] 
        
        
    }]

});


export interface IAnomaly extends Document {
    name: string;
    solutions:[];
    
}

export const Anomaly = model<IAnomaly>('Anomaly', anomalySchema);
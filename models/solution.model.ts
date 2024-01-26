import { Schema, model, Document } from 'mongoose';

const solutionSchema = new Schema({

    name: {
        type: String,
        required: [true, 'name is required'],
        unique: true
    },
    description: {
        type: String,
    },
    materials: [{
        material:{
            type: Schema.Types.ObjectId,
        ref: 'Material',
        required: [true, 'no se encontro usuario'] 
        },
        qty:{
            type: Number
        }
    }]

});


export interface ISolution extends Document {
    name: string;
    description: string;
    materials:[{
        material:string;
        qty:number;
    }];
    
}

export const Solution = model<ISolution>('Solution', solutionSchema);
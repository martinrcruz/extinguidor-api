import { Schema, model, Document } from 'mongoose';

const commentSchema = new Schema({

    comentario: {
        type: String,
        required: [true, 'comentario'],
        unique: true
    },
    date:{
        type: Date,
        require: [true, '']
    },
    parte: {
        type: Schema.Types.ObjectId,
        ref: 'Parte',
        required: [true, '']    
    },
    lat:{},
    lgn:{},
    fotos:[]

});


export interface IComment extends Document {
    comentario: string;
    date: Date;
    parte: string;
    
}

export const Comment = model<IComment>('Comment', commentSchema);
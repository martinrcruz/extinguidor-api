import { Schema, model, Document } from 'mongoose';

const commentSchema = new Schema({

    comment: {
        type: String,
        required: [true, 'name is required'],
        unique: true
    },
    date:{
        type: Date,
        require: [true, '']
    },
    report: {
        type: Schema.Types.ObjectId,
        ref: 'Report',
        required: [true, '']    
    }

});


export interface IComment extends Document {
    comment: string;
    date: Date;
    report: string;
    
}

export const Comment = model<IComment>('Comment', commentSchema);
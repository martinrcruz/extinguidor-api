import { Schema, model, Document } from 'mongoose';


const checkinSchema = new Schema({

    checkin: {
        startTime: {
            type: Number,
            required: [true, 'checkin-startTime is required'] 
        },
        ubication: {
            lat: { type: Number },
            long: { type: Number }
        },
    },
    checkout: {
        startTime: {
            type: Number,
        },
        ubication: {
            lat: { type: Number },
            long: { type: Number }
        },
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'userId is required']
    },
    reportId: {
        type: Schema.Types.ObjectId,
        ref: 'reports',
        required: [true, 'reportId is required'] 
    }

});


export interface ICheckin extends Document {
    checkin: {
        startTime: number;
        ubication: {
            lat: number;
            long: number;
        };
    };
    checkout: {
        startTime: number;
        ubication: {
            lat: number ,
            long: number 
        },
    };
    userId: Schema.Types.ObjectId;
    reportId: Schema.Types.ObjectId;
    
}

export const Checkin = model<ICheckin>('Checkin', checkinSchema);
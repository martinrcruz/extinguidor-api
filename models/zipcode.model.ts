import { Schema, model, Document } from 'mongoose';

const zipcodeSchema = new Schema(
    {
        name: String,
        codezip: { type: String, required: true, unique: true }
    },
    { versionKey: false }          // elimina __v
);

export interface IZipcode extends Document {
    name?: string;
    codezip: string;
}

export const Zipcode = model<IZipcode>('Zipcode', zipcodeSchema);

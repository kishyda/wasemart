import { UploadResponse } from "imagekit/dist/libs/interfaces";
import { Model, model, models, Schema } from "mongoose";

type Ad = {
    title: string;
    price: number;
    category: string;
    description: string;
    contact: string;
    files: UploadResponse[];
    location: {
        lat: number;
        lng: number;
    },
    userEmail: string;
};

const adSchema = new Schema<Ad>({
    title: String,
    price: Number,
    category: String,
    description: String,
    contact: String,
    files: [Object],
    location: Object,
    //userEmail: {type: String, required: true},
},{
    timestamps: true,
});

adSchema.index({location:'2dsphere'});

export const AdModel = (models?.Ad as Model<Ad>) || model<Ad>('Ad', adSchema);
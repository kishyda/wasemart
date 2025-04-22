'use server';
import mongoose from "mongoose";
import { AdModel } from "../models/Ad";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

async function connect() {
    return mongoose.connect(process.env.MONGODB_URL as string);
  }

export async function createAd(formData: FormData){
    const {files, location, ...data} = Object.fromEntries(formData);
    await connect();
    const session = await getServerSession(authOptions);
    const newAdData = {
        ...data,
        files: JSON.parse(files as string),
        location: JSON.parse(location as string),
        userEmail: session?.user?.email,
    };
    const newAdDoc = await AdModel.create(newAdData);
    return JSON.parse(JSON.stringify(newAdDoc));
}
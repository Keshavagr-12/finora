import mongoose from "mongoose";
import { env } from "./env.js";

const connectDB = async () => {
    const connection = await mongoose.connect(
        env.MONGO_URI
    );

    console.log(
        `MongoDB Connected: ${connection.connection.host}`
    );

    console.log(
        `Database: ${connection.connection.name}`
    );
};

export default connectDB;
import mongoose from "mongoose";

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not configured");
    }

    const connection = await mongoose.connect(
        process.env.MONGO_URI
    );

    console.log(
        `MongoDB Connected: ${connection.connection.host}`
    );

    console.log(
        `Database: ${connection.connection.name}`
    );
};

export default connectDB;
import mongoose from "mongoose";

const connecttoDb = async () => {
    
    mongoose.connection.on('connected', () => {
        console.log("Database connected successfully! (Mongoose event)");
    });

    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/authentication`);
        console.log("Database connection call completed"); 

    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

export default connecttoDb;


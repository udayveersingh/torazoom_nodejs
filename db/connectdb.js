import mongoose from 'mongoose';

const connectDB = async (DATABASE_URI)=>{
    console.log(DATABASE_URI);
    console.log("--- database uri -----");
    try {
        const DB_OPTIONS = {
            user:process.env.DB_USERNAME,
            pass:process.env.DB_PASSWORD,
            dbName:process.env.DB_NAME
        }
        await mongoose.connect(DATABASE_URI, DB_OPTIONS);
        console.log("connected successfully -----");
    } catch (err) {
        console.log(err);
    }
}

export default connectDB;
import mongoose from 'mongoose';


export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: true,
        });
        console.log(`DB connected successfully at host id: ${conn.connection.host}`.cyan.bold)
    } catch (error) {
        console.error(`Error: ${error.message}`.red.bold);
        process.exit(1);
    }
}
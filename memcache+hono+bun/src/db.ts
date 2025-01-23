import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const mongouri=process.env.MONGO_URI;
        await mongoose.connect(mongouri as string, {
        });
        console.log('✅ MongoDB connected');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    }
};

export default connectDB;
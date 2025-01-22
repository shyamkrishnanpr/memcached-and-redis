import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://shyamkrishnasby:9847848779@cluster0.zynk5xc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
        });
        console.log('✅ MongoDB connected');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    }
};

export default connectDB;


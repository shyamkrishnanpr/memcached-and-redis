const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://shyamkrishnasby:9847848779@cluster0.zynk5xc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
        });
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;




import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Radhe Radhe❤️, MongoDB connected successfully!');
  } catch (err) {
    console.error("MongoDB connection error",`${err}`);
    process.exit(1);
  }
};

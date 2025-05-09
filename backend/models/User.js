import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    name: { type: String }, // optional
    profilePic: { type: String }, // ✅ added this field
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

export default User;
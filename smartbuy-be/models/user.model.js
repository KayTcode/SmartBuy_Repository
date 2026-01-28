import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define schema
const userSchema = new Schema({
    email: { 
        type: String, 
        required: [true, "Email is required"], 
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { 
        type: String,
        required: function() {
            return this.authProvider === 'local';
        }
    },
    name: { 
        type: String, 
        required: [true, "Name is required"],
        trim: true
    },
    phone: { 
        type: String,
        trim: true
    },
    address: { 
        type: String,
        trim: true
    },
    avatar: {
        type: String,
        default: null
    },
    role: { 
        type: String, 
        enum: ["user", "admin"], 
        default: "user" 
    },
    // Google OAuth fields
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows null values while maintaining uniqueness
    },
    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
    // Account status
    isActive: {
        type: Boolean,
        default: true
    },
    lastLoginAt: {
        type: Date
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

const User = mongoose.model("User", userSchema);

export default User;
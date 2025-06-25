import mongoose from "mongoose";   

const userSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    verifyotp: {
        type: String,
        default: '',
    },
    verifyotpexpiredat: {
        type: Number,
        default: 0,
    },
    isverified: {
        type: Boolean,
        default: false,
    },
    resetotp: {
        type: String,
        default: ''
    },
    resetotpexpiredat: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
})

const userModel=mongoose.models.user||mongoose.model('user', userSchema)//it will try to create the user model again and again when we import this file, so we need to use mongoose.model() method to create the model only once

export default userModel
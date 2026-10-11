"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const mongoose_1 = require("mongoose");
const providerSchema = new mongoose_1.Schema({
    providerName: {
        type: String,
        enum: ["google", "microsoft"],
        required: true
    },
    providerId: {
        type: String,
        required: true
    }
}, { _id: false });
const userSchema = new mongoose_1.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minlength: 3,
        maxlength: 20,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
    },
    passwordHash: {
        type: String,
        select: false,
    },
    providers: {
        type: [providerSchema],
        default: []
    },
    avatar: {
        type: String,
    },
    fullName: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 160,
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
userSchema.index({ "providers.providerId": 1, "providers.providerName": 1 });
exports.user = (0, mongoose_1.model)("user", userSchema);

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
exports.getUserByUsername = getUserByUsername;
exports.updateProfile = updateProfile;
exports.setAvatar = setAvatar;
exports.removeAvatar = removeAvatar;
const AppError_1 = require("../config/AppError");
const userModel_1 = require("../model/userModel");
const serializer_1 = require("../utils/serializer");
const upload_service_1 = require("../services/upload.service");
function getAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
        const filter = {};
        if (typeof req.query.q === "string" && req.query.q.trim()) {
            // Escape regex characters so "a.b" searches for literally "a.b"
            const escaped = req.query.q.trim().toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            filter.username = { $regex: `^${escaped}` };
        }
        const [users, total] = yield Promise.all([
            userModel_1.user.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            userModel_1.user.countDocuments(filter),
        ]);
        res.json({
            users: users.map(serializer_1.toPublicProfile),
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        });
    });
}
function getUserByUsername(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = String(req.params.username).toLowerCase();
        const userByUserName = yield userModel_1.user.findOne({ username });
        if (!userByUserName)
            throw new AppError_1.AppError(404, "User not found");
        res.json({ user: (0, serializer_1.toPublicProfile)(userByUserName) });
    });
}
function updateProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const updates = req.body;
        if (updates.username) {
            const takenUserName = yield userModel_1.user.exists({
                username: updates.username,
                _id: { $ne: req.userId },
            });
            if (takenUserName)
                throw new AppError_1.AppError(409, "Username already taken");
        }
        const user1 = yield userModel_1.user.findByIdAndUpdate(req.userId, { $set: updates }, { new: true, runValidators: true });
        if (!user1)
            throw new AppError_1.AppError(404, "User not found");
        res.json({ user: (0, serializer_1.toPublicUser)(user1) });
    });
}
const avatarPublicId = (userId) => `mini-social/avatars/${userId}`;
function setAvatar(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.file)
            throw new AppError_1.AppError(400, "Avatar image is required");
        const result = yield (0, upload_service_1.uploadBuffer)(req.file.buffer, {
            public_id: avatarPublicId(req.userId),
            overwrite: true,
            invalidate: true,
            resource_type: "image",
            transformation: [{ width: 400, height: 400, crop: "fill", gravity: "auto" }],
        });
        const newUser = yield userModel_1.user.findByIdAndUpdate(req.userId, { avatar: result.secure_url }, { new: true });
        if (!userModel_1.user)
            throw new AppError_1.AppError(404, "User not found");
        res.json({ user: (0, serializer_1.toPublicUser)(newUser) });
    });
}
function removeAvatar(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const newUser = yield userModel_1.user.findByIdAndUpdate(req.userId, { $unset: { avatar: "" } }, { new: true });
        if (!userModel_1.user)
            throw new AppError_1.AppError(404, "User not found");
        (0, upload_service_1.deleteAsset)(avatarPublicId(req.userId)).catch((err) => console.error("Failed to delete avatar asset:", err));
        res.json({ user: (0, serializer_1.toPublicUser)(newUser) });
    });
}

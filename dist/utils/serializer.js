"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPublicProfile = toPublicProfile;
exports.toPublicUser = toPublicUser;
exports.adminUser = adminUser;
// Safe for anyone to see
function toPublicProfile(user) {
    return {
        id: user._id,
        userName: user.userName,
        fullName: user.fullName,
        bio: user.bio,
        avatar: user.avatar,
        createdAt: user.createdAt,
    };
}
// For the logged-in user's own account only
function toPublicUser(user) {
    return Object.assign(Object.assign({}, toPublicProfile(user)), { email: user.email, isVerified: user.isVerified, role: user.role });
}
function adminUser(user) {
    return Object.assign(Object.assign({}, toPublicUser(user)), { isSuspended: user.isSuspended, providers: user.providers.map((p) => p.providers), updatedAt: user.updatedAt });
}

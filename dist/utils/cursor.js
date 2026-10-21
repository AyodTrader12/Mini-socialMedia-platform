"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeCursor = encodeCursor;
exports.decodeCursor = decodeCursor;
const mongoose_1 = require("mongoose");
const AppError_1 = require("../config/AppError");
function encodeCursor(post) {
    const payload = { t: post.createdAt.getTime(), id: post._id.toString() };
    return Buffer.from(JSON.stringify(payload)).toString("base64url");
}
function decodeCursor(raw) {
    if (raw === undefined || raw === "")
        return null;
    try {
        const { t, id } = JSON.parse(Buffer.from(String(raw), "base64url").toString());
        if (typeof t !== "number" || !mongoose_1.Types.ObjectId.isValid(id))
            throw new Error();
        return { createdAt: new Date(t), id: new mongoose_1.Types.ObjectId(id) };
    }
    catch (_a) {
        throw new AppError_1.AppError(400, "Invalid cursor");
    }
}

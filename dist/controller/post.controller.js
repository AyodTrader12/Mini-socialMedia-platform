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
exports.createPost = createPost;
const AppError_1 = require("../config/AppError");
const userModel_1 = require("../model/userModel");
const postModel_1 = require("../model/postModel");
const serializer_1 = require("../utils/serializer");
const post_service_1 = require("../services/post.service");
function createPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { caption } = req.body;
        const files = (_a = req.files) !== null && _a !== void 0 ? _a : [];
        (0, post_service_1.assertValidPost)(files);
        const author = yield userModel_1.user.findById(req.userId);
        if (!author)
            throw new AppError_1.AppError(404, "User not found");
        const media = yield (0, post_service_1.uploadPostMedia)(files);
        // If saving fails, don't leave the uploaded files orphaned
        const post = yield postModel_1.Post.create({
            author: author._id,
            caption: caption !== null && caption !== void 0 ? caption : "",
            media,
        }).catch((err) => __awaiter(this, void 0, void 0, function* () {
            yield (0, post_service_1.deletePostMedia)(media);
            throw err;
        }));
        res.status(201).json({ post: (0, serializer_1.toPost)(post, author) });
    });
}

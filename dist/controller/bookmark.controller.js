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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBookmark = addBookmark;
exports.removeBookmark = removeBookmark;
exports.getSavedPosts = getSavedPosts;
const mongoose_1 = __importDefault(require("mongoose"));
const postModel_1 = require("../model/postModel");
const bookMark_1 = require("../model/bookMark");
const AppError_1 = require("../config/AppError");
const post_service_1 = require("../services/post.service");
function parsePostId(raw) {
    const id = String(raw);
    if (!mongoose_1.default.isValidObjectId(id))
        throw new AppError_1.AppError(404, "Post not found");
    return id;
}
function addBookmark(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const postId = parsePostId(req.params.id);
        if (!(yield postModel_1.Post.exists({ _id: postId }))) {
            throw new AppError_1.AppError(404, "Post not found");
        }
        try {
            yield bookMark_1.Bookmark.create({ user: req.userId, post: postId });
        }
        catch (err) {
            // 11000 = already saved. That's fine, saving twice is not an error.
            if (err.code !== 11000)
                throw err;
        }
        res.json({ bookmarked: true });
    });
}
function removeBookmark(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const postId = parsePostId(req.params.id);
        yield bookMark_1.Bookmark.deleteOne({ user: req.userId, post: postId });
        res.json({ bookmarked: false });
    });
}
function getSavedPosts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, post_service_1.getSavedPostsPage)({
            viewerId: req.userId,
            cursor: req.query.cursor,
            limit: req.query.limit,
        });
        res.json(result);
    });
}

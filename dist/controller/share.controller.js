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
exports.sharePostPage = sharePostPage;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../config/env");
const postModel_1 = require("../model/postModel");
const userModel_1 = require("../model/userModel");
const escapeHtml_1 = require("../utils/escapeHtml");
const SITE_NAME = "Mini Social";
function notFoundPage(res) {
    res
        .status(404)
        .type("html")
        .send(`<!doctype html><meta charset="utf-8"><title>Post not found</title><p>Post not found.</p>`);
}
function sharePostPage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const id = String(req.params.id);
        if (!mongoose_1.default.isValidObjectId(id))
            return notFoundPage(res);
        const post = yield postModel_1.Post.findById(id);
        const author = post ? yield userModel_1.user.findById(post.author) : null;
        if (!post || !author)
            return notFoundPage(res);
        const postUrl = `${env_1.env.CLIENT_URL.replace(/\/$/, "")}/post/${post.id}`;
        const name = author.fullName || `@${author.userName}`;
        const title = `${name} on ${SITE_NAME}`;
        const caption = (_b = (_a = post.caption) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "";
        const description = caption
            ? caption.length > 200
                ? `${caption.slice(0, 197)}...`
                : caption
            : `View this post on ${SITE_NAME}`;
        // For videos, Cloudinary gives a still frame if you ask for .jpg instead of .mp4
        const first = post.media[0];
        const image = first
            ? first.type === "video"
                ? first.url.replace(/\.[^./]+$/, ".jpg")
                : first.url
            : null;
        const t = (0, escapeHtml_1.escapeHtml)(title);
        const d = (0, escapeHtml_1.escapeHtml)(description);
        const u = (0, escapeHtml_1.escapeHtml)(postUrl);
        const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${t}</title>
  <meta name="description" content="${d}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:title" content="${t}">
  <meta property="og:description" content="${d}">
  <meta property="og:url" content="${u}">
  ${image ? `<meta property="og:image" content="${(0, escapeHtml_1.escapeHtml)(image)}">` : ""}
  <meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}">
  <meta http-equiv="refresh" content="0; url=${u}">
</head>
<body>
  <p><a href="${u}">Open this post on ${SITE_NAME}</a></p>
</body>
</html>`;
        res
            .set("Cache-Control", "public, max-age=300")
            .type("html")
            .send(html);
    });
}

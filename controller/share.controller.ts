import { Request, Response } from "express";
import mongoose from "mongoose";
import { env } from "../config/env";
import { Post } from "../model/postModel";
import { user } from "../model/userModel";
import { escapeHtml } from "../utils/escapeHtml";

const SITE_NAME = "Mini Social";

function notFoundPage(res: Response) {
  res
    .status(404)
    .type("html")
    .send(`<!doctype html><meta charset="utf-8"><title>Post not found</title><p>Post not found.</p>`);
}

export async function sharePostPage(req: Request, res: Response) {
  const id = String(req.params.id);
  if (!mongoose.isValidObjectId(id)) return notFoundPage(res);

  const post = await Post.findById(id);
  const author = post ? await user.findById(post.author) : null;
  if (!post || !author) return notFoundPage(res);

  const postUrl = `${env.CLIENT_URL.replace(/\/$/, "")}/post/${post.id}`;
  const name = author.fullName || `@${author.userName}`;
  const title = `${name} on ${SITE_NAME}`;

  const caption = post.caption?.trim() ?? "";
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

  const t = escapeHtml(title);
  const d = escapeHtml(description);
  const u = escapeHtml(postUrl);

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
  ${image ? `<meta property="og:image" content="${escapeHtml(image)}">` : ""}
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
}
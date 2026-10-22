import { Request, Response } from "express";
import mongoose from "mongoose";
import { Post } from "../model/postModel";
import { Bookmark } from "../model/bookMark";
import { AppError } from "../config/AppError";
import { getSavedPostsPage } from "../services/post.service";

function parsePostId(raw: unknown) {
  const id = String(raw);
  if (!mongoose.isValidObjectId(id)) throw new AppError(404, "Post not found");
  return id;
}

export async function addBookmark(req: Request, res: Response) {
  const postId = parsePostId(req.params.id);

  if (!(await Post.exists({ _id: postId }))) {
    throw new AppError(404, "Post not found");
  }

  try {
    await Bookmark.create({ user: req.userId, post: postId });
  } catch (err) {
    // 11000 = already saved. That's fine, saving twice is not an error.
    if ((err as { code?: number }).code !== 11000) throw err;
  }

  res.json({ bookmarked: true });
}

export async function removeBookmark(req: Request, res: Response) {
  const postId = parsePostId(req.params.id);

  await Bookmark.deleteOne({ user: req.userId, post: postId });

  res.json({ bookmarked: false });
}

export async function getSavedPosts(req: Request, res: Response) {
  const result = await getSavedPostsPage({
    viewerId: req.userId!,
    cursor: req.query.cursor,
    limit: req.query.limit,
  });
  res.json(result);
}
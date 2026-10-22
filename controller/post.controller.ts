import { Request,Response } from "express";
import { AppError } from "../config/AppError";
import { user } from "../model/userModel";
import { Post } from "../model/postModel";
import { CreatePostInput } from "../validators/post.validator";
import { toPost } from "../utils/serializer";
import { uploadPostMedia,assertValidPost,deletePostMedia } from "../services/post.service";
import mongoose from "mongoose";
import { getPostsPage } from "../services/post.service";
import { serializePosts } from "../services/post.service";
export async function createPost(req: Request, res: Response) {
  const { caption } = req.body as CreatePostInput;
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];

  assertValidPost(caption,files);

  const author = await user.findById(req.userId);
  if (!author) throw new AppError(404, "User not found");

  const media = await uploadPostMedia(files);

  // If saving fails, don't leave the uploaded files orphaned
  const post = await Post.create({
    author: author._id,
    caption: caption ?? "",
    media,
  }).catch(async (err) => {
    await deletePostMedia(media);
    throw err;
  });

  res.status(201).json({ post: toPost(post, author) });
}

export async function getFeed(req: Request, res: Response) {
  const result = await getPostsPage({
    cursor: req.query.cursor,
    limit: req.query.limit,
    viewerId: req.userId,
  });
  res.json(result);
}

export async function getPostById(req: Request, res: Response) {
  const id = String(req.params.id);
  if (!mongoose.isValidObjectId(id)) throw new AppError(404, "Post not found");

  const post = await Post.findById(id);
  if (!post) throw new AppError(404, "Post not found");

  const [serialized] = await serializePosts([post], req.userId);
  if (!serialized) throw new AppError(404, "Post not found"); // author was deleted

  res.json({ post: serialized });
}
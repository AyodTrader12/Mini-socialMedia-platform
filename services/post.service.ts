import { LIMITS } from "../config/limits";
import { AppError } from "../config/AppError";
import { uploadBuffer,deleteAsset } from "./upload.service";

export type PostMedia = {
  url: string;
  publicId: string;
  type: "image" | "video";
  width?: number;
  height?: number;
};

// export async function uploadPostMedia(files: Express.Multer.File[]): Promise<PostMedia[]> {
//   if (files.length === 0) return [];
//   // ...rest unchanged
// }

const isVideo = (file: Express.Multer.File) => file.mimetype.startsWith("video/");

/** Enforces: at least 1 file, and either all images (each within size) or exactly one video. */
/** A post needs a caption or media. Media, if present, is either all images or exactly one video. */
export function assertValidPost(caption: string | undefined, files: Express.Multer.File[]) {
  if (files.length === 0) {
    if (!caption?.trim()) {
      throw new AppError(400, "Write something or attach an image or video");
    }
    return;
  }

  const hasVideo = files.some(isVideo);

  if (hasVideo) {
    if (files.length > 1) {
      throw new AppError(400, "A post can have one video or up to 10 images, not both");
    }
    return;
  }

  for (const file of files) {
    if (file.size > LIMITS.imageSize) {
      throw new AppError(400, "Each image must be 5MB or smaller");
    }
  }
}
async function uploadOne(file: Express.Multer.File): Promise<PostMedia> {
  const video = isVideo(file);

  const result = await uploadBuffer(file.buffer, {
    folder: "mini-social/posts",
    resource_type: video ? "video" : "image",
    // Cap huge photos at 1600px wide and let Cloudinary pick the quality
    ...(video ? {} : { transformation: [{ width: 1600, crop: "limit", quality: "auto" }] }),
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    type: video ? "video" : "image",
    width: result.width,
    height: result.height,
  };
}

/** Uploads all files in parallel. If any fails, deletes the ones that succeeded and throws. */
export async function uploadPostMedia(files: Express.Multer.File[]): Promise<PostMedia[]> {
    if(files.length === 0) return []
  const results = await Promise.allSettled(files.map(uploadOne));

  const uploaded: PostMedia[] = [];
  let failure: unknown = null;

  for (const result of results) {
    if (result.status === "fulfilled") uploaded.push(result.value);
    else failure ??= result.reason;
  }

  if (failure) {
    await deletePostMedia(uploaded);
    throw failure;
  }

  return uploaded;
}

export async function deletePostMedia(media: PostMedia[]) {
  await Promise.allSettled(media.map((m) => deleteAsset(m.publicId, m.type)));
}
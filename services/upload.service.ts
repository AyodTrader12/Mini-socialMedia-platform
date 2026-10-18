import { UploadApiOptions, UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary";
import { AppError } from "../config/AppError";


export const avatarPublicId = (userId: string) => `mini-social/avatars/${userId}`;
export function uploadBuffer(
  buffer: Buffer,
  options: UploadApiOptions
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error || !result) {
        console.error("Cloudinary upload failed:", error);
        // 400 = Cloudinary rejected the file itself, anything else = their service/our config
        const status = error?.http_code === 400 ? 400 : 502;
        const message =
          status === 400 ? "The uploaded file is invalid" : "Upload failed, please try again";
        reject(new AppError(status, message));
        return;
      }
      resolve(result);
    });
    stream.end(buffer);
  });
}

export async function deleteAsset(
  publicId: string,
  resourceType: "image" | "video" = "image"
) {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    invalidate: true,
  });
}
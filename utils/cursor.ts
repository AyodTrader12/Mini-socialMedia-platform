import { Types } from "mongoose";
import { AppError } from "../config/AppError";


export function encodeCursor(post: { createdAt: Date; _id: Types.ObjectId }): string {
  const payload = { t: post.createdAt.getTime(), id: post._id.toString() };
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

export function decodeCursor(raw: unknown): { createdAt: Date; id: Types.ObjectId } | null {
  if (raw === undefined || raw === "") return null;

  try {
    const { t, id } = JSON.parse(Buffer.from(String(raw), "base64url").toString());
    if (typeof t !== "number" || !Types.ObjectId.isValid(id)) throw new Error();
    return { createdAt: new Date(t), id: new Types.ObjectId(id) };
  } catch {
    throw new AppError(400, "Invalid cursor");
  }
}
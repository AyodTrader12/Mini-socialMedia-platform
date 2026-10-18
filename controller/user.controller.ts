import { Request,Response } from "express";
import { AppError } from "../config/AppError";
import { user } from "../model/userModel";
import { UpdateProfileInput } from "../validators/user.validator";
import { toPublicProfile, toPublicUser } from "../utils/serializer";
import { uploadBuffer,deleteAsset,avatarPublicId } from "../services/upload.service";

export async function getAllUsers(req: Request, res: Response) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));

  const filter: Record<string, unknown> = {};
  if (typeof req.query.q === "string" && req.query.q.trim()) {
    // Escape regex characters so "a.b" searches for literally "a.b"
    const escaped = req.query.q.trim().toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.username = { $regex: `^${escaped}` };
  }

  const [users, total] = await Promise.all([
    user.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    user.countDocuments(filter),
  ]);

  res.json({
    users: users.map(toPublicProfile),
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
}

export async function getUserByUsername(req: Request, res: Response) {
  const username = String(req.params.username).toLowerCase();

  const userByUserName = await user.findOne({ username });
  if (!userByUserName) throw new AppError(404, "User not found");

  res.json({ user: toPublicProfile(userByUserName) });
}

export async function updateProfile(req: Request, res: Response) {
  const updates = req.body as UpdateProfileInput;

  if (updates.username) {
    const takenUserName = await user.exists({
      username: updates.username,
      _id: { $ne: req.userId },
    });
    if (takenUserName) throw new AppError(409, "Username already taken");
  }

  const user1: any = await user.findByIdAndUpdate(
    req.userId,
    { $set: updates },
    { new: true, runValidators: true }
  );
  if (!user1) throw new AppError(404, "User not found");

  res.json({ user: toPublicUser(user1) });
}

// const avatarPublicId = (userId: string) => `mini-social/avatars/${userId}`;

export async function setAvatar(req: Request, res: Response) {
  if (!req.file) throw new AppError(400, "Avatar image is required");

  const result = await uploadBuffer(req.file.buffer, {
    public_id: avatarPublicId(req.userId!),
    overwrite: true,
    invalidate: true,
    resource_type: "image",
    transformation: [{ width: 400, height: 400, crop: "fill", gravity: "auto" }],
  });

  const newUser:any = await user.findByIdAndUpdate(
    req.userId,
    { avatar: result.secure_url },
    { new: true }
  );
  if (!user) throw new AppError(404, "User not found");

  res.json({ user: toPublicUser(newUser) });
}

export async function removeAvatar(req: Request, res: Response) {
  const newUser:any = await user.findByIdAndUpdate(
    req.userId,
    { $unset: { avatar: "" } },
    { new: true }
  );
  if (!user) throw new AppError(404, "User not found");

  deleteAsset(avatarPublicId(req.userId!)).catch((err) =>
    console.error("Failed to delete avatar asset:", err)
  );

  res.json({ user: toPublicUser(newUser) });
}
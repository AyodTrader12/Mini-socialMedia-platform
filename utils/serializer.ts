import { user } from "../model/userModel";

type UserDoc = InstanceType<typeof user>;

// Safe for anyone to see
export function toPublicProfile(user: UserDoc) {
  return {
    id: user._id,
    userName: user.userName,
    fullName: user.fullName,
    bio: user.bio,
    avatar: user.avatar,
    createdAt: user.createdAt,
  };
}

// For the logged-in user's own account only
export function toPublicUser(user: UserDoc) {
  return {
    ...toPublicProfile(user),
    email: user.email,
    isVerified: user.isVerified,
  };
}
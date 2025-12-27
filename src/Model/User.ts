import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  username: string;
  password?: string;

  isVerified: boolean;

  verifyCode?: string;
  verifyCodeExpiry?: Date;

  isAcceptingMessages: boolean;
  provider: "credentials" | "google";
}

const MessageSchema = new Schema({
  content: String,
  createdAt: Date,
});

const UserSchema = new Schema(
  {
    email: { type: String, required: true },
    username: { type: String, required: true },

    password: String,

    isVerified: {
      type: Boolean,
      default: false,
    },

    verifyCode: {
      type: String,
    },

    verifyCodeExpiry: {
      type: Date,
    },

    isAcceptingMessages: {
      type: Boolean,
      default: true,
    },

    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },

    messages: {
      type: [MessageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);

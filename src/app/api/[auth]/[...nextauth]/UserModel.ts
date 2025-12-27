import mongoose, { Schema, Document } from "mongoose";

export interface IMessage {
  content: string;
  createdAt: Date;
}



export interface IUser extends Document {
  email: string;
  username: string;
  password?: string;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  provider: "credentials" | "google";
  messages: IMessage[];
  verifyCode?: string;
  verifyCodeExpiry?: Date;
}

const MessageSchema = new Schema<IMessage>({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// const UserSchema = new Schema<IUser>(
//   {
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     username: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     password: {
//       type: String,
//     },

//     isVerified: {
//       type: Boolean,
//       default: false,
//     },

//     isAcceptingMessages: {
//       type: Boolean,
//       default: true,
//     },

//     provider: {
//       type: String,
//       enum: ["credentials", "google"],
//       required: true,
//     },

//     verifyCode: {
//       type: String,
//     },

//     verifyCodeExpiry: {
//       type: Date,
//     },

//     messages: {
//       type: [MessageSchema],
//       default: [],
//     },
//   },
//   { timestamps: true }
// );


const UserSchema = new mongoose.Schema({
  email: String,
  username: String,
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
});


export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);

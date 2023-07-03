import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      public_id: {
        type: String,
       
      },
      url: {
        type: String,
        
      },
    },
   
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
   createdBy: {
    type: mongoose.ObjectId,
        ref: "users",
   },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    profile: { type: String},
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
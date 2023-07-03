import mongoose from "mongoose";

const layerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
        type: String,
    },
   
    url: {
      type: String,
      required: true,
      unique: true,
    },
    source: {
      type: String,
      required: true,
    },
   createdBy: {
    type: mongoose.ObjectId,
        ref: "users",
   },
    parameter: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      default:false,
    },
    allowedTo: [{
      type: mongoose.ObjectId,
          ref: "roles",
     },],
    
  },
  { timestamps: true }
);

export default mongoose.model("layers", layerSchema);
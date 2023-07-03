import mongoose from "mongoose";

const baseMapSchema = new mongoose.Schema(
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
    visible: {
        type: Boolean,
        default:false,
      },
   createdBy: {
    type: mongoose.ObjectId,
        ref: "users",
   },
  
    imagerySet: {
      type: String,
      required: false,
      default:'Road',
    },
    key: {
      type: String,
      required: false,
    },
    allowedTo: [{
      type: mongoose.ObjectId,
          ref: "roles",
     },],
    
  },
  { timestamps: true }
);

export default mongoose.model("baseMaps", baseMapSchema);
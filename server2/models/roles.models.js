import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    access:[
        {
            type: String,
            required: true,
            default:"see",
        }
    ]
   
    
  },
  { timestamps: true }
);

export default mongoose.model("roles", roleSchema);
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Planning", "In Progress", "Completed"],
      default: "Planning",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    tasks: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalTasks: {
      type: Number,
      default: 0,
      min: 0,
    },

    members: {
      type: Number,
      default: 1,
      min: 0,
    },

    dueDate: {
      type: String,
      default: "",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
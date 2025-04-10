const { Schema, model } = require("mongoose");

const moodLogSchema = new Schema(
  {
    mood: {
      type: String,
      required: true,
      enum: ["happy", "sad", "angry", "anxious", "romantic", "bored"],
    },
    note: {
      type: String,
    },
    recommendations: {
      type: Schema.Types.ObjectId,
      ref: "Recommendation",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const MoodLogModel = model("MoodLog", moodLogSchema);

module.exports = MoodLogModel;

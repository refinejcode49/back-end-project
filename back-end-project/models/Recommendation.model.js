const { Schema, model } = require("mongoose");

const recommendationSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["movie", "song", "book", "quote", "podcast"],
    },
    title: {
      type: String,
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    url: {
      type: String,
    },
    mood: {
      type: String,
      required: true,
      enum: [
        "happy",
        "sad",
        "angry",
        "tired",
        "anxious",
        "romantic",
        "bored",
        "calm",
      ],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamp: true }
);

const RecommendationModel = model("Recommendation", recommendationSchema);

module.exports = RecommendationModel;

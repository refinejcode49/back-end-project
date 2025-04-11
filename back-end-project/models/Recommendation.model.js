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
    image: {
      type: String,
    },
    mood: {
      type: String,
      required: true,
      enum: [
        "happy",
        "sad",
        "angry",
    
        "anxious",
        "romantic",
        "bored",
        
      ],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required:true
    },
  },
  { timestamp: true }
);

const RecommendationModel = model("Recommendation", recommendationSchema);

module.exports = RecommendationModel;

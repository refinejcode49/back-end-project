const router = require("express").Router();
const express = require("express");
const RecommendationModel = require("../models/Recommendation.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");

// Get all recommendations (no mood filter)
router.get("/all-recommendations", async (req, res) => {
  try {
    const recommendations = await RecommendationModel.find().populate("user");
    res.status(201).json(recommendations);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ errorMessage: "Trouble finding all recommendations" });
  }
});

// GET recommendations filtered by mood
router.get("/mood", async (req, res, next) => {
  const { mood } = req.query;
  try {
    //filter through mood in the model if no mood then return an empty object, no filtering and show all recommendations
    const filter = mood ? { mood: mood } : {};
    const recos = await RecommendationModel.find(filter);
    res.status(201).json(recos);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      errorMessage: "Trouble finding your recommendation by your mood",
    });
  }
});

router.post("/create-recommendation", async (req, res) => {
  const { category, title, creator, description, image, mood, user } = req.body;
  try {
    const newReco = await RecommendationModel.create({
      category,
      title,
      creator,
      description,
      image,
      mood,
      user,
    });
    res.status(201).json(newReco);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ errorMessage: "Trouble creating your recommendation" });
  
}
});

router.get("/recommendation/:id", async (req, res) => {
  try {
    const reco = await RecommendationModel.findById(req.params.id);
    if (!reco)
      return res.status(404).json({ message: "Recommendation not found" });
    res.json(reco);
  } catch (error) {
    console.log(error);
  }
});

router.put(
  "/recommendation/update-recommendation/:recommendationId",
  async (req, res) => {
    const { category, title, creator, description, image, mood } = req.body;
    try {
      const updatedReco = await RecommendationModel.findByIdAndUpdate(
        req.params.recommendationId,
        req.body,
        { new: true }
      );
      console.log("recommendation updated ", updatedReco);
      res.status(200).json(updatedReco);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ errorMessage: "Trouble updating your recommendation" });
    }
  }
);

router.delete(
  "/recommendation/delete-recommendation/:recommendationId",
  async (req, res) => {
    try {
      const deletedRecommendation = await RecommendationModel.findByIdAndDelete(
        req.params.recommendationId
      );

      if (!deletedRecommendation) {
        return res.status(404).json({ message: "Recommendation not found" });
      }

      res
        .status(204)
        .json({ message: "Recommendation deleted", deletedRecommendation});
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ errorMessage: "Trouble deleting your recommendation" });
    }
  }
);

// GET Routes to get the recommendation favorited or avoided by an userId
router.get("/user-recommendations/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const userRecoDoc = await UserRecommendationModel.findOne({ user: userId });

    if (!userRecoDoc) {
      return res.status(200).json({ favorites: [], avoided: [] });
    }

    // get the favortied recommendation
    const favoriteRecs = await RecommendationModel.find({
      _id: { $in: userRecoDoc.favorites },
    });

    // get the recommendation avoided
    const avoidedRecs = await RecommendationModel.find({
      _id: { $in: userRecoDoc.avoided },
    });

    res.status(200).json({
      favorites: favoriteRecs,
      avoided: avoidedRecs,
    });
  } catch (error) {
    console.error("Error fetching user recommendations:", error);
    res
      .status(500)
      .json({ errorMessage: "Unable to fetch user recommendations" });
  }
});

module.exports = router;

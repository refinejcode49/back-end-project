const router = require("express").Router();
const express = require("express");
const RecommendationModel = require("../models/Recommendation.model");

// Get all recommendations (no mood filter)
router.get("/all-recommendations", async (req, res) => {
  try {
    const recommendations = await RecommendationModel.find();
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
  const { category, title, creator, description, url, user, mood } = req.body;
  try {
    const newReco = await RecommendationModel.create({
      category,
      title,
      creator,
      description,
      url,
      mood,
      user,
      image,
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

router.put("/recommendation/:id", async (req, res) => {
  try {
    const updatedReco = await RecommendationModel.findByIdAndUpdate(
      req.params.id,
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
});

router.delete("/recommendation/:id", async (req, res) => {
  try {
    await RecommendationModel.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: "Recommendation deleted" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ errorMessage: "Trouble deleting your recommendation" });
  }
});

module.exports = router;

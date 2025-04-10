const router = require("express").Router();
const MoodLogModel = require("../models/MoodLog.model");

// ===== CREATE: POST /mood/create =====
//router.post("/create", async (req, res) => {
  router.post("/", async (req, res) => {
    const { mood, userId } = req.body;

  try {
    const newMoodEntry = await MoodLogModel.create({
      mood,
      user: userId,
    });
    res.status(201).json(newMoodEntry);
  } catch (err) {
    console.error("Error creating mood log:", err);
    res.status(500).json({ errorMessage: "Could not create mood entry" });
  }
});

// ===== READ ALL: GET /mood/all-mood =====
router.get("/all-mood", async (req, res) => {
  MoodLogModel.find()
    .sort({ createdAt: -1 })
    .then((allMoods) => {
      console.log("All moods:", allMoods);
      res.status(200).json({ moods: allMoods });
    })
    .catch((err) => {
      console.log("Error fetching moods:", err);
      res.status(500).json({ errorMessage: "Could not fetch moods" });
    });
});

// ===== READ BY USER: GET /mood/user/:moodId =====
//router.get("/user/:moodId", async (req, res) => {
router.get("/user/:userId", async (req, res) => {
  MoodLogModel.find({ user: req.params.userId })
    .sort({ createdAt: -1 })
    .then((userMoods) => {
      console.log("Moods for user:", userMoods);
      res.status(200).json(userMoods);
    })
    .catch((err) => {
      console.log("Error getting user moods:", err);
      res.status(500).json({ errorMessage: "Could not fetch user moods" });
    });
});

// ===== UPDATE: PUT /mood/update/:moodId =====
router.put("/update/:moodId", async (req, res) => {
  MoodLogModel.findByIdAndUpdate(req.params.moodId, req.body, { new: true })
    .then((updatedMood) => {
      console.log("Mood updated:", updatedMood);
      res.status(200).json(updatedMood);
    })
    .catch((err) => {
      console.log("Error updating mood:", err);
      res.status(500).json({ errorMessage: "Could not update mood" });
    });
});

// ===== DELETE: DELETE /mood/delete/:moodId =====
router.delete("/delete/:moodId", async (req, res) => {
  MoodLogModel.findByIdAndDelete(req.params.moodId)
    .then(() => {
      console.log("Mood deleted:", req.params.moodId);
      res.status(200).json({ message: "Mood deleted successfully" });
    })
    .catch((err) => {
      console.log("Error deleting mood:", err);
      res.status(500).json({ errorMessage: "Could not delete mood" });
    });
});
// ===== STATS: GET /mood/stats =====
// Count each mood and return stats
router.get("/stats", async (req, res) => {
  try {
    const { userId } = req.query; // Get the user ID from the query parameters
    if (!userId) {
      return res.status(400).json({ errorMessage: "User ID is required" });
    }
    const stats = await MoodLogModel.aggregate([
      {
        $match: { user: userId }, // Filter recommendations by the user ID
      },
      {
        $group: {
          _id: "$mood", // Group by the mood field
          count: { $sum: 1 }, // Count the number of occurrences for each mood
        },
      },
    ]);

    if (stats.length === 0) {
      console.log("No stats found for the given user.");
      return res.status(200).json({});
    }

    const formatted = {};
    stats.forEach((entry) => {
      formatted[entry._id] = entry.count; // Format the results into an object
    });
    res.status(200).json(formatted); // Send the formatted stats as a response
  } catch (err) {
    console.log("Error generating mood stats:", err);
    res.status(500).json({ errorMessage: "Could not fetch mood statistics" });
  }
});

module.exports = router;

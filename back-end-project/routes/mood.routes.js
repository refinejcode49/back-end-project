const router = require('express').Router();
const Mood = require('../models/MoodLog.model');

// ===== CREATE: POST /mood/create =====
router.post('/create', async (req, res) => {
Mood.create(req.body)
.then((createdMood) => {
console.log("Mood logged!", createdMood);
res.status(201).json(createdMood);
})
.catch((err) => {
console.log("Error logging mood:", err);
res.status(500).json({ errorMessage: "Failed to log mood" });
});
});

// ===== READ ALL: GET /mood/all-mood =====
router.get('/all-mood', async (req, res) => {
Mood.find()
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
router.get('/user/:moodId', async (req, res) => {
Mood.find({ userId: req.params.moodId })
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
router.put('/update/:moodId', async (req, res) => {
Mood.findByIdAndUpdate(req.params.moodId, req.body, { new: true })
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
router.delete('/delete/:moodId', async (req, res) => {
Mood.findByIdAndDelete(req.params.moodId)
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
router.get('/stats', async (req, res) => {
    try {
    const stats = await Mood.aggregate([
    {
    $group: {
    _id: '$mood',
    count: { $sum: 1 }
    }
    }
    ]);
    
    const formatted = {};
    stats.forEach((entry) => {
    formatted[entry._id] = entry.count;
    });
    
    res.status(200).json(formatted);
    } catch (err) {
    console.log("Error generating mood stats:", err);
    res.status(500).json({ errorMessage: "Could not fetch mood statistics" });
    }
    });


module.exports = router;
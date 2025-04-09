const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");

// to create a user with a hashed password
router.post("/signup", async (req, res) => {
  try {
    const salt = bcryptjs.genSaltSync(12);
    const hashedPassword = bcryptjs.hashSync(req.body.password, salt);
    const hashedUser = {
      ...req.body,
      password: hashedPassword,
    };
    // to create a user in the database
    const newUser = await UserModel.create(hashedUser);
    console.log("success creating the user !", newUser);
    res.status(201).json({ message: "user successfully created in the DB" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// login route to find the user by email and check if they know the password
router.post("/login", async (req, res) => {
  try {
    // find the user by their email
    const foundUser = await UserModel.findOne({ email: req.body.email });
    if (!foundUser) {
      res.status(400).json({ errorMessage: "Email not found" });
    } else {
      // if we find the user by their email we then compare their password (from the DB and the frontend)
      const passwordFromFrontend = req.body.password;
      const passwordHashedInDB = foundUser.password;
      const passwordsMatch = bcryptjs.compareSync(
        passwordFromFrontend,
        passwordHashedInDB
      );
      //console.log("password match ? ", passwordsMatch);
      if (!passwordsMatch) {
        res.status(400).json({ errorMessage: "Password incorrect" });
      } else {
        // the email exist and the password match
        // the non secret data that we will put into the token
        const data = { _id: foundUser._id, username: foundUser.username };
        const authToken = jwt.sign(data, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "1w",
        });
        res.status(200).json({ message: "you are logged in!", authToken });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"something went wrong",error});
  }
});

// route to check if the token is present and valid
router.get("/verify", isAuthenticated, async (req, res) => {
  console.log("here in the verify route");
  res.status(200).json({ message: "token valid", payload: req.payload });
});

module.exports = router;

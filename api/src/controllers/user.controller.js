import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { SERVER_URL } from "../../src/constants.js";

// 1. User Registration
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already taken!",
      });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
    });

    // Generate the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    // Save user
    await newUser.save();

    // Send the verification email to the registered user
    sendVerificationEmail(newUser.email, newUser.verificationToken);

    res.status(200).json({
      success: true,
      message: "User is successfully registered!",
      user: newUser,
    });
  } catch (error) {
    console.log("Registeration failed!", error);
    res.status(500).json({
      success: false,
      message: "Error while registering user!",
    });
  }
};

// 2. Verification Email
const sendVerificationEmail = async (email, verificationToken) => {
  const tranporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "farooque.simnainfo@gmail.com",
      pass: process.env.APP_PASSWORD,
    },
  });

  // Mail options
  const mailOptions = {
    from: "matchmate.com",
    to: email,
    subject: "Email Verfication",
    text: `Please click on the following link to verify your email : ${SERVER_URL}/api/v1/user/verify/${verificationToken}`,
  };

  //Send email
  try {
    await tranporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error while sending verification email: ", error);
  }
};

// 3. Verify User
export const verify = async (req, res) => {
  try {
    const token = req.params.token;

    //Find user
    const user = await User.findOne({ verificationToken: token });

    // Validation
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid verification token.",
      });
    }

    //Verify user
    user.verified = true;
    user.verificationToken = undefined;

    //Save user
    user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    console.log("User verification error: ", error);
    res.status(500).json({
      success: false,
      message: "Error while verifying user",
    });
  }
};

// Generate Secret Key
const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
};

const secretKey = generateSecretKey();

// 4. User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    //Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    //Check password
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    //User token
    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(200).json({
      success: true,
      message: "Logged in successfully,",
      token,
    });
  } catch (error) {
    console.log("Login failed!", error);
    res.status(500).json({
      success: false,
      message: "Error while loggin in user.",
    });
  }
};

// 5. Update Gender
export const updateGender = async (req, res) => {
  try {
    const { userId } = req.params;
    const { gender } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { gender: gender },
      { new: true }
    );

    //Validation
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Gender updated successfully.",
    });
  } catch (error) {
    console.log("Error while updating gender. ", error);
    res.status(500).json({
      success: false,
      message: "An error occured while updating user's gender.",
    });
  }
};

// 6. Update Description
export const userDescription = async (req, res) => {
  try {
    const { userId } = req.params;
    const { description } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        description: description,
      },
      { new: true }
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    return res
      .status(200)
      .json({ success: true, message: "User description updated succesfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while updating user description.",
    });
  }
};

// 7. Get User Data
export const userData = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: "User not found." });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while getting user data.",
    });
  }
};

// 8. Add Turn-Ons
export const addTurnOns = async (req, res) => {
  try {
    const { userId } = req.params;
    const { turnOn } = req.body;
    console.log("Turn On: ", turnOn);
    console.log("User ID: ", userId);

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { turnOns: turnOn } },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    return res
      .status(200)
      .json({ success: true, message: "Turn on updated succesfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while adding turn-ons.",
    });
  }
};

// 9. Remove Turn-Ons
export const removeTurnOns = async (req, res) => {
  try {
    const { userId } = req.params;
    const { turnOn } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { turnOns: turnOn } },
      { new: true }
    );

    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      message: "Turn-On removed successfully.",
      user,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error while removing Turn-Ons" });
  }
};

// 10. Add Looking For
export const addLokingFor = async (req, res) => {
  try {
    const { userId } = req.params;
    const { lookingFor } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { lookingFor: lookingFor },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res
      .status(200)
      .json({ message: "Looking For updated succesfully", user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error while adding Looking-For" });
  }
};

// 11. Remove Looking For
export const removeLookingFor = async (req, res) => {
  try {
    const { userId } = req.params;
    const { lookingFor } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { lookingFor: lookingFor },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res
      .status(200)
      .json({ message: "Looking For updated succesfully", user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error while removing Looking-For" });
  }
};

// 12. Upload Image
export const uploadProfileImage = async (req, res) => {
  try {
    const { userId } = req.params;
    const { imageUrl } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    user.profileImages.push(imageUrl);

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Profile image has been added.", user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error while adding profile images" });
  }
};

// Get All Profiles
export const getAllProfiles = async (req, res) => {
  const { userId, gender, turnOns, lookingFor } = req.query;
  try {
    let filter = { gender: gender === "male" ? "female" : "male" }; // For gender filtering

    // Add filtering based on turnOns and lookingFor arrays
    if (turnOns) {
      filter.turnOns = { $in: turnOns };
    }

    if (lookingFor) {
      filter.lookingFor = { $in: lookingFor };
    }

    const currentUser = await User.findById(userId)
      .populate("matches", "_id")
      .populate("crushes", "_id");

    // Extract IDs of friends
    const friendIds = currentUser.matches.map((friend) => friend._id);

    // Extract IDs of crushes
    const crushIds = currentUser.crushes.map((crush) => crush._id);

    const profiles = await User.find(filter)
      .where("_id")
      .nin([userId, ...friendIds, ...crushIds]);

    return res.status(200).json({ profiles });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error fetching profiles", error });
  }
};

export const sendLike = async (req, res) => {
  try {
    const { currentUserId, selectedUserId } = req.body;

    //Update the recepient's friendRequests array
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { recievedLikes: currentUserId },
    });

    // Updates the sender's crush array
    await User.findByIdAndUpdate(currentUserId, {
      $push: { crushes: selectedUserId },
    });

    res.status(200).json({ success: true, message: "Profile liked!" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to like profile." });
  }
};

// Get details of Received Like
export const getReceivedLikeDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch details of users who liked the current user

    const receivedLikesDetails = [];
    for (const likedUserId of user.recievedLikes) {
      const likedUser = await User.findById(likedUserId);
      if (likedUser) {
        receivedLikesDetails.push(likedUser);
      }
    }
    res.status(200).json({ receivedLikesDetails });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while getting details of Received Likes. ",
      error,
    });
  }
};
// Create a match betweeen two people
export const createMatch = async (req, res) => {
  try {
    const { currentUserId, selectedUserId } = req.body;

    // Update the selected user's crushes array and the matches array
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { matches: currentUserId },
      $pull: { crushes: currentUserId },
    });

    // Update the current user's matches array recievedlikes array
    await User.findByIdAndUpdate(currentUserId, {
      $push: { matches: selectedUserId },
      $pull: { recievedLikes: selectedUserId },
    });

    res.status(200).json({ success: true, message: "You Got A Match!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while creating a match. ",
      error,
    });
  }
};

// Get all the matches of the particular user
export const getAllMatches = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found!" });
    }

    const matchesIds = user.matches;
    const matches = await User.find({ _id: { $in: matchesIds } });

    res.status(200).json({ matches });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while getting all matches. ",
      error,
    });
  }
};

// Get messagess

export const getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;

    console.log(senderId);
    console.log(receiverId);
    const messages = await Chat.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).populate("senderId", "_id name");

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while fetching messages. ",
      error,
    });
  }
};

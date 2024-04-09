import { Router } from "express";
import {
  addLokingFor,
  addTurnOns,
  createMatch,
  getAllMatches,
  getAllProfiles,
  getMessages,
  getReceivedLikeDetails,
  login,
  registerUser,
  removeLookingFor,
  removeTurnOns,
  sendLike,
  updateGender,
  uploadProfileImage,
  userData,
  userDescription,
  verify,
} from "../controllers/user.controller.js";

const router = Router();

// Register User
router.route("/register").post(registerUser);

// Verify User
router.route("/verify/:token").get(verify);

// Login User
router.route("/login").post(login);

// Update Gender
router.route("/:userId/gender").put(updateGender);

// Update Description
router.route("/:userId/description").put(userDescription);

// Get User Data
router.route("/:userId/data").get(userData);

// Add Turn Ons
router.route("/:userId/turn-ons/add").put(addTurnOns);

// Remove Turn Ons
router.route("/:userId/turn-ons/remove").put(removeTurnOns);

// Add Looking For
router.route("/:userId/looking-for/add").put(addLokingFor);

// Remove Looking For
router.route("/:userId/looking-for/remove").put(removeLookingFor);

// Profile Images
router.route("/:userId/profile-images").post(uploadProfileImage);

// Get All Profiles
router.route("/profiles").get(getAllProfiles);

// Send Like
router.route("/send-like").post(sendLike);

// Get Details of Received Likes
router.route("/received-likes/:userId/details").get(getReceivedLikeDetails);

// Match Tow People
router.route("/create-match").post(createMatch);

// Get All Matches
router.route("/:userId/matches").get(getAllMatches);

// Get All Messages
router.route("/messages").get(getMessages);

export default router;

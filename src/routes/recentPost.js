const express = require("express");
const router = express.Router();

const recentPostController = require("../Controllers/recentPostController");
const { verifyToken, verifyTokenAdmin } = require("../middleware/CheckLogin");
const upload = require("../middleware/upload");

router.post(
  "/post-status",
  verifyToken,
  upload.single("imageUrl"),
  recentPostController.postStatus
);

router.get("/get-all", verifyToken, recentPostController.getAllRecentPosts);

router.get(
  "/get-my-status/:id",
  verifyToken,
  recentPostController.getRecentDoctorId
);

router.delete(
  "/delete-status/:id",
  verifyToken,
  recentPostController.deleteStatus
);

module.exports = router;

const express = require("express");
const router = express.Router();

const commentController = require("../Controllers/commentController");
const { verifyToken } = require("../middleware/CheckLogin");

router.post("/comment-status", verifyToken, commentController.commentStatus);

router.get(
  "/get-comment-post/:id",
  verifyToken,
  commentController.getCommentPost
);

module.exports = router;

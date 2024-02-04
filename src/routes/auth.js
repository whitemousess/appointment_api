const express = require("express");
const router = express.Router();

const userController = require("../Controllers/userController");
const { verifyToken, verifyTokenAdmin } = require("../middleware/CheckLogin");
const upload = require("../middleware/upload");

router.post("/new-doctor", verifyTokenAdmin, userController.addDoctor);

router.get("/get-doctor", verifyToken, userController.getDoctor);
router.get("/get-user", verifyTokenAdmin, userController.getUser);

router.delete("/user/delete/:id", verifyTokenAdmin, userController.deleteUser);
router.put(
  "/edit-user/:id",
  verifyToken,
  upload.single("imageUrl"),
  userController.editUser
);

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/current-user", verifyToken, userController.currentUser);

module.exports = router;

const router = require("express").Router();

const { verifyToken } = require("../middleware/CheckLogin");
const appointmentController = require("../Controllers/appointmentController");

router.post(
  "/new-appointment",
  verifyToken,
  appointmentController.newAppointment
);

router.get(
  "/cancel-appointment/:id",
  verifyToken,
  appointmentController.cancelAppointment
);
router.get(
  "/success-appointment/:id",
  verifyToken,
  appointmentController.successAppointment
);

router.delete(
  "/delete-appointment/:id",
  verifyToken,
  appointmentController.deleteAppointment
);

router.get(
  "/get-appointment",
  verifyToken,
  appointmentController.getAppointment
);
router.get(
  "/get-history-appointment",
  verifyToken,
  appointmentController.getHistoryAppointment
);
router.get("/my-appointment", verifyToken, appointmentController.myAppointment);

module.exports = router;

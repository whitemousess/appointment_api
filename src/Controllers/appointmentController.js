const appointmentModel = require("../models/appointmentModel");
const axios = require("axios");

module.exports = {
  async newAppointment(req, res, next) {
    const appointment = new appointmentModel(req.body);
    appointment
      .save()
      .then((data) => {
        res.status(200).json({
          data: data,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: "error",
          message: err.message,
        });
      });
  },

  getAppointment(req, res, next) {
    const { page, per_page, doctorId, date, time } = req.query;
    const objWhere = {};

    if (date) objWhere.date = date;
    if (time) objWhere.time = time;
    if (doctorId) objWhere.doctorId = doctorId;

    appointmentModel
      .find(objWhere)
      .populate(["doctorId", "currentUserId"])
      .sort({ _id: -1 })
      .then((data) => {
        const currentPage = parseInt(page) || 1;
        const itemsPerPage = parseInt(per_page) || data.length;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        const totalItems = data.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        const items = data.slice(startIndex, endIndex);

        res.json({
          data: items,
          currentPage,
          totalPages,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: "error",
          message: err.message,
        });
      });
  },

  predictDiseases(req, res, next) {
    axios
      .get(`${process.env.AI_URL}predict_diseases?symptoms=${req.body.sicks}`)
      .then((data) => {
        res.json({ data: data.data.certain_predicted_diseases });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  },

  getHistoryAppointment(req, res, next) {
    appointmentModel
      .find({ currentUserId: req.user.id })
      .sort({ _id: -1 })
      .populate(["doctorId", "currentUserId"])
      .then((data) => {
        res.json({ data });
      })
      .catch((err) => {
        res.status(500).json({
          status: "error",
          message: err.message,
        });
      });
  },

  myAppointment(req, res, next) {
    appointmentModel
      .find({ doctorId: req.user.id })
      .sort({ _id: -1 })
      .populate(["doctorId", "currentUserId"])
      .then((data) => {
        res.json({ data });
      })
      .catch((err) => {
        res.status(500).json({
          status: "error",
          message: err.message,
        });
      });
  },

  deleteAppointment(req, res, next) {
    appointmentModel
      .findOneAndDelete({ _id: req.params.id })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  cancelAppointment(req, res, next) {
    appointmentModel
      .findOneAndUpdate({ _id: req.params.id }, { status: "2" })
      .then((data) => {
        res.json({ data });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  successAppointment(req, res, next) {
    appointmentModel
      .findOneAndUpdate({ _id: req.params.id }, { status: "1" })
      .then((data) => {
        res.json({ data });
      })
      .catch((err) => {
        console.log(err);
      });
  },
};

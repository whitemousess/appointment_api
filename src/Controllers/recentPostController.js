const recentPostModel = require("../models/recentPostModel");
const commentModel = require("../models/commentModel");

module.exports = {
  postStatus(req, res, next) {
    if (req.file) {
      const fileBuffer = req.file.buffer;
      const base64Data = fileBuffer.toString("base64");
      req.body.imageUrl = `data:image/jpeg;base64,${base64Data}`;
    }
    req.body.doctorId = req.user.id;

    const recentPost = new recentPostModel(req.body);
    recentPost
      .save()
      .then((data) => {
        res.json({ data: data });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  getAllRecentPosts(req, res, next) {
    recentPostModel
      .find()
      .populate("doctorId")
      .sort({ _id: -1 })
      .then((data) => {
        res.json({ data: data });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  getRecentDoctorId(req, res, next) {
    recentPostModel
      .find({ doctorId: req.params.id })
      .sort({ _id: -1 })
      .populate("doctorId")
      .then((data) => {
        res.json({ data: data });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  deleteStatus(req, res, next) {
    const deleteComment = async () => {
      await commentModel.deleteMany({ recentPostId: req.params.id });
    };

    recentPostModel
      .findByIdAndDelete(req.params.id)
      .populate("doctorId")
      .then((data) => {
        deleteComment();
        res.json({ data: data });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
};

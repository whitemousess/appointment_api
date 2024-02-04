const commentModel = require("../models/commentModel");

module.exports = {
  commentStatus(req, res, next) {
    const comment = new commentModel(req.body);
    comment
      .save()
      .then((data) => res.json({ data }))
      .catch((err) => res.status(500).json(err));
  },

  getCommentPost(req, res, next) {
    commentModel
      .find({ recentPostId: req.params.id })
      .sort({ _id: -1 })
      .populate(["recentPostId", "currentUserId"])
      .then((data) => res.json({ data }))
      .catch((err) => res.status(500).json(err));
  },
};

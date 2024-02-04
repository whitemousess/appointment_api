const authRouter = require("./auth");
const appointmentRouter = require("./appointment");
const recentPostRouter = require("./recentPost");
const commentRouter = require("./comment");

function route(app) {
  app.use("/api/auth", authRouter);
  app.use("/api/appointment", appointmentRouter);
  app.use("/api/recent-post", recentPostRouter);
  app.use("/api/comment-post", commentRouter);
  app.use("/", function (req, res, next) {
    res.send("NOT FOUND");
  });
}

module.exports = route;

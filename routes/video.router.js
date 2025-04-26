const { Router } = require("express");
const {
  getVideos,
  postLike,
  postComment,
  removeLike,
} = require("../controllers/video.controller");
const videoRouter = Router();

videoRouter.get("/", getVideos);
videoRouter.put("/like/:videoId", postLike);
videoRouter.put("/comment/:videoId", postComment);
videoRouter.put("/remove-like/:videoId", removeLike);

module.exports = videoRouter;

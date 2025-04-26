const mongoose = require("mongoose");

const videoModel = new mongoose.Schema({
  title: { type: String, required: true },
  src: { type: String, required: true },
  description: { type: String, required: true },
  likes: [
    {
      likedBy: {
        type: String,
        unique: true,
      },
      likedAt: { type: Date, default: Date.now },
    },
  ],
  comments: [
    {
      commentedBy: String,
      commentedAt: { type: Date, default: Date.now },
      comment: String,
    },
  ],
});

const Video = mongoose.model("Video", videoModel);
module.exports = Video;

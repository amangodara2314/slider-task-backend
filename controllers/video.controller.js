const Video = require("../models/video.model");

exports.getVideos = async (req, res) => {
  try {
    const { page = 1, limit = 9 } = req.query;
    const userIp = req.ipAddress;

    const videos = await Video.aggregate([
      {
        $project: {
          title: 1,
          src: 1,
          description: 1,
          comments: 1,
          likeCount: { $size: "$likes" },
          liked: {
            $in: [userIp, "$likes.likedBy"],
          },
        },
      },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
    ]);
    if (page == 1) {
      const totalCount = await Video.countDocuments();
      res.status(200).json({ videos, totalCount });
      return;
    }
    res.status(200).json({ videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId).lean();
    if (!video) {
      return res.status(404).json({ message: "Internal Server Error" });
    }
    if (video.likes.some((like) => like.likedBy === req.ipAddress)) {
      res.status(200).json({ video: { ...video, liked: true } });
      return;
    }
    res.status(200).json({ video });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.postLike = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { ipAddress } = req;

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (video.likes.some((like) => like.likedBy === ipAddress)) {
      return res
        .status(400)
        .json({ message: "You have already liked this video" });
    }

    video.likes.push({ likedBy: ipAddress, likedAt: Date.now() });

    await video.save();
    res.status(200).json({ message: "Liked successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.removeLike = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { ipAddress } = req;

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const likeIndex = video.likes.findIndex(
      (like) => like.likedBy === ipAddress
    );
    if (likeIndex === -1) {
      return res.status(404).json({ message: "Like not found" });
    }

    video.likes.splice(likeIndex, 1);

    await video.save();
    res.status(200).json({ message: "Like removed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.postComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { ipAddress } = req;
    const { comment } = req.body;

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    video.comments.push({
      commentedBy: ipAddress,
      commentedAt: Date.now(),
      comment,
    });

    await video.save();
    res.status(200).json({ message: "Commented successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

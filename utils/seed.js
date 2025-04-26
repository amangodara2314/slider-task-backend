const Video = require("../models/video.model");
const { SEED_DATA } = require("./constant");

const seed = async () => {
  try {
    const videos = await Video.countDocuments();
    if (SEED_DATA.length == videos) {
      console.log("data found - seeding aborted");
      return;
    }
    await Video.create(SEED_DATA);
    console.log("Seeding successful");
  } catch (error) {
    console.log(error);
  }
};

module.exports = seed;

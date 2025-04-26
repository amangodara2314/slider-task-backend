require("dotenv").config();
const cors = require("cors");
const { getIpAddress } = require("./utils/middleware");
const seed = require("./utils/seed");
const express = require("express");
const videoRouter = require("./routes/video.router");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

app.use("/api/video", getIpAddress, videoRouter);

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    await seed();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

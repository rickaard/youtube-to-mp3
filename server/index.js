import express from "express";
import cors from "cors";
import fs from "fs";
import {
  checkFileExists,
  removeFile,
  convertToMp3,
  downloadYoutubeVideo,
} from "./converter";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/temp", express.static("temp"));

if (process.env.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = Path.dirname(__filename);

  app.use(express.static(Path.join(__dirname, "client/build")));
  app.get("/*", function (req, res) {
    res.sendFile(Path.join(__dirname, "client/build", "index.html"));
  });
}

app.get("/api", (req, res) => {
  res.status(200).json({ message: "hello" });
});

app.post("/api/video", async (req, res) => {
  const { ytid } = req.body;
  const FIVE_MINUTES = 300000;

  try {
    const video = await downloadYoutubeVideo(ytid);

    setTimeout(async () => {
      const checkFile = await checkFileExists(ytid);
      if (checkFile) {
        try {
          removeFile(ytid);
          console.log(`${ytid}.mp4 was deleted`);
        } catch (err) {
          console.log("Something went wrong trying to remove file: ", err);
        }
      } else {
        console.log("File does not exists");
      }
    }, FIVE_MINUTES);

    return res
      .status(200)
      .json({
        status: "ok",
        message: "downloaded video",
        link: video.filepath,
      });
  } catch (err) {
    console.log(err);

    res.status(500).json({ status: "error", message: "Something went wrong" });
  }
});

app.post("/api/convert", async (req, res) => {
  const { ytid, starttime, endtime, title } = req.body;

  try {
    const convertedFile = await convertToMp3(ytid, starttime, endtime, title);

    res.download(`temp/${convertedFile}`, (err) => {
      if (err)
        return console.log(
          "Something went wrong while trying to download",
          err
        );

      fs.unlink(`${__dirname}/temp/${ytid}.mp3`, () => {
        console.log("mp3-file deleted");
      });

      fs.unlink(`${__dirname}/temp/${ytid}.mp4`, () => {
        console.log("mp4-file deleted");
      });
    });
  } catch (err) {
    console.log("Error trying to convert video to mp3: ");

    res.status(404).json({
      status: "error",
      message: "Something went wrong / file does not exists",
    });
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () =>
  console.log(`Server is upp and running on port: ${PORT}`)
);

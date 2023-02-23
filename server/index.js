import express from "express";
import cors from "cors";
import fs from "fs";
import { fileURLToPath } from "url";
import { checkFileExists, removeFile, convertToMp3, downloadYoutubeVideo } from "./converter.js";
import path from "path";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/temp", express.static("temp"));

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

    return res.status(200).json({
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
      if (err) return console.log("Something went wrong while trying to download", err);

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

if (process.env.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(express.static(__dirname + "/../client/build"));
  app.get("/*", function (req, res) {
    res.sendFile(__dirname + "/../client/build", "index.html");
  });
}

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Server is upp and running on port: ${PORT}`));

import readline from "readline";
import ytcog from "ytcog";
import fs from "fs";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
ffmpeg.setFfmpegPath(ffmpegPath);

export const checkFileExists = (fileId) => {
  return new Promise((resolve, reject) => {
    fs.access(`${__dirname}/temp/${fileId}.mp4`, fs.F_OK, (err) => {
      if (err) {
        resolve(false);
      }

      resolve(true);
    });
  });
};

export const removeFile = (fileId) => {
  return new Promise((resolve, reject) => {
    fs.unlink(`${__dirname}/temp/${fileId}.mp4`, (err) => {
      if (err) reject(err);

      resolve(`${fileId}.mp4 was deleted`);
    });
  });
};

export const convertToMp3 = (ytid, starttime, endtime, title = "youtube-to-mp3") => {
  const duration = endtime - starttime;

  let start = Date.now();

  return new Promise((resolve, reject) => {
    ffmpeg(`./temp/${ytid}.mp4`)
      .setStartTime(parseInt(starttime))
      .setDuration(duration)
      .audioBitrate(128)
      .save(`${__dirname}/temp/${ytid}.mp3`)
      .on("progress", (p) => {
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`${p.targetSize}kb downloaded`);
      })
      .on("error", (err) => {
        console.log("Error inside convertToMp3");
        reject(err);
      })
      .on("end", () => {
        console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
        const filepath = `${ytid}.mp3`;
        resolve(filepath);
      });
  });
};

export const downloadYoutubeVideo = async (ytid) => {
  try {
    await ytcog.dl({
      id: ytid,
      downloaded: 0,
      path: "./temp",
      filename: ytid,
      container: "mp4",
      audioQuality: "medium",
      progress: (prg, siz, tot) => {
        this.downloaded += siz;
        process.stdout.write(`Progress ${Math.floor(prg)}% - ${this.downloaded}/${tot}   \r`);
      },
      overwrite: "yes",
    });

    return { filepath: `/temp/${ytid}.mp4` };
  } catch (err) {}
};

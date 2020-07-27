const readline = require('readline');
const ytdl = require('ytdl-core');
const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);



const checkFileExists = (fileId) => {

  return new Promise((resolve, reject) => {
    fs.access(`${__dirname}/temp/${fileId}.mp4`, fs.F_OK, (err) => {
      if (err) {
        resolve(false)
      }

      resolve(true);
    })
  })


}

const removeFile = (fileId) => {
  return new Promise((resolve, reject) => {
    fs.unlink(`${__dirname}/temp/${fileId}.mp4`, (err) => {
      if (err) reject(err);

      resolve(`${fileId}.mp4 was deleted`);
    });
  })
}

const removeFileAfterSpecifiedTime = (fileId) => {
  return console.log('3 sekunder har gått, raderar fil: ', fileId);
}

const convertToMp3 = (ytid, starttime, endtime, title = 'youtube-to-mp3') => {
  const duration = endtime - starttime;

  let start = Date.now();

  return new Promise((resolve, reject) => {
    ffmpeg(`./temp/${ytid}.mp4`)
      .setStartTime(parseInt(starttime))
      .setDuration(duration)
      .audioBitrate(128)
      .save(`${__dirname}/temp/${ytid}.mp3`)
      .on('progress', p => {
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`${p.targetSize}kb downloaded`);
      })
      .on('error', (err) => {
        console.log('Error inside convertToMp3');
        reject(err)
      })
      .on('end', () => {
        console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
        const filepath = `${ytid}.mp3`;
        resolve(filepath);
      });
  })
};

const downloadYoutubeVideo = async (ytid) => {
  console.log('Trying to download video...');


  // get youtube title
  const info = await ytdl.getInfo(ytid);

  return new Promise((resolve, reject) => {

    ytdl(ytid)
      .pipe(fs.createWriteStream(`${__dirname}/temp/${ytid}.mp4`))
      .once('response', () => {
        starttime = Date.now();
      })
      .on('progress', (chunkLength, downloaded, total) => {
        const percent = downloaded / total;
        const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
        const estimatedDownloadTime = (downloadedMinutes / percent) - downloadedMinutes;
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded `);
        process.stdout.write(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)\n`);
        process.stdout.write(`running for: ${downloadedMinutes.toFixed(2)}minutes`);
        process.stdout.write(`, estimated time left: ${estimatedDownloadTime.toFixed(2)}minutes `);
        readline.moveCursor(process.stdout, 0, -1);
      })
      .on('error', (err) => {
        reject(err)
      })
      .on('finish', () => {
        console.log('Video downloaded!')
        // const filepath = `${__dirname}/temp/${ytid}.mp4`;
        const file = {
          title: info.title,
          // filepath: `http://localhost:3003/temp/${ytid}.mp4`
          filepath: `${__dirname}/temp/${ytid}.mp4`
        }
        resolve(file);
      })
  })
}

module.exports = {
  checkFileExists,
  removeFile,
  convertToMp3,
  downloadYoutubeVideo,
  removeFileAfterSpecifiedTime
}


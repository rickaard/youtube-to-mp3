const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const {
    checkFileExists,
    removeFile,
    convertToMp3,
    downloadYoutubeVideo,
    removeFileAfterSpecifiedTime
} = require('./converter');

app.use(express.json());
app.use('/temp', express.static('temp'));
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'hello' })
});

app.post('/video', async (req, res) => {
    const { ytid } = req.body;

    console.log('Tagit emot POST,', ytid);

    try {
        const video = await downloadYoutubeVideo(ytid);

        // after 5 minutes -> see if file still exists,
        // if so -> delete it
        setTimeout(async () => {
            const checkFile = await checkFileExists(ytid);
            if (checkFile) {
                try {
                    removeFile(ytid);
                    console.log(`${ytid}.mp4 was deleted`);
                } catch (err) {
                    console.log('Something went wrong trying to remove file: ', err);
                }
            } else {
                console.log('File does not exists');
            }
        }, 300000); // 300000 =  5 minutes

        res.status(200).json({ status: 'ok', message: 'downloaded video', link: video.filepath, title: video.title })
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'error', message: 'Something went wrong' })
    }
})

app.post('/convert', async (req, res) => {

    // youtube id
    const { ytid } = req.body;

    // start time and end time
    const { starttime } = req.body;
    const { endtime } = req.body;
    const { title } = req.body;

    try {
        const convertedFile = await convertToMp3(ytid, starttime, endtime, title);

        res.download(`temp/${convertedFile}`, err => {
            if (err) return console.log('Something went wrong while trying to download', err);
            console.log('Download succeed!');
            fs.unlink(`${__dirname}/temp/${ytid}.mp3`, () => {
                console.log('mp3-file deleted')
            });
            fs.unlink(`${__dirname}/temp/${ytid}.mp4`, () => {
                console.log('mp4-file deleted')
            });
        })
    } catch (err) {
        console.log('Error trying to convert video to mp3: ');
        res.status(404).json({ status: 'error', message: 'Something went wrong / file does not exists' })
    }

})




const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Server is upp and running on port: ${PORT}`));
import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import styles from "./VideoPlayer.module.scss";

const isDev = process.env.NODE_ENV === "development";

const VideoPlayer = ({ videolink, goBackToStart, convertToMp3 }) => {
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const videoRef = useRef(null);

  const formatTime = (seconds) => {
    if (seconds < 3540) {
      return new Date(seconds * 1000).toISOString().substr(14, 5);
    }
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  };

  return (
    <div className={styles.videocontainer}>
      <ReactPlayer
        url={isDev ? `http://localhost:3003${videolink}` : videolink}
        controls
        playsinline
        pip={false}
        ref={videoRef}
        onReady={(v) => setEndTime(v.getDuration())}
      />
      <div className={styles.buttonwrapper}>
        <button onClick={() => setStartTime(videoRef.current.getCurrentTime())}>
          Set start time
        </button>
        <span>
          {formatTime(startTime)} - {formatTime(endTime)}
        </span>
        <button onClick={() => setEndTime(videoRef.current.getCurrentTime())}>
          Set end time
        </button>
      </div>

      <div className={styles.buttonwrapper}>
        <button className={styles.startoverBtn} onClick={goBackToStart}>
          Start over
        </button>
        <button
          className={styles.convertBtn}
          onClick={() => convertToMp3(startTime, endTime)}
        >
          Convert
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;

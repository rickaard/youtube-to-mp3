import React from "react";
import styles from "./ConvertWrapper.module.scss";

import VideoPlayer from "../VideoPlayer/VideoPlayer";

const ConvertWrapper = ({ videolink, convertToMp3, goBackToStart }) => {
  return (
    <div className={styles.content}>
      <VideoPlayer
        videolink={videolink}
        convertToMp3={convertToMp3}
        goBackToStart={goBackToStart}
      />
    </div>
  );
};

export default ConvertWrapper;

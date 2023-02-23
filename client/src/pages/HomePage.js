import React, { useState } from "react";
import FormWrapper from "../components/FormWrapper/FormWrapper";
import ConvertWrapper from "../components/ConvertWrapper/ConvertWrapper";
import Loader from "../components/Loader/Loader";
import download from "downloadjs";

const HomePage = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [videolink, setVideolink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [youtubeID, setYoutubeID] = useState(null);
  const [youtubeTitle, setYoutubeTitle] = useState("");
  const [error, setError] = useState(null);

  const getVideo = (link, id) => {
    setIsLoading(true);
    setYoutubeID(id);

    // POST youtube ID to server
    // get back link with youtube movie downloaded to mp4
    fetch("/api/video/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ytid: id }),
    })
      .then((response) => response.json())
      .then((data) => {
        setVideolink(data.link);
        setIsLoading(false);
        setShowVideo(true);
        setYoutubeTitle(data.ytid);
      })
      .catch((err) => console.log(err));
  };

  const goBackToStart = () => {
    setShowVideo(false);
    setVideolink(null);
    setYoutubeID(null);
    setYoutubeID(null);
    setYoutubeTitle("");
    setError(null);
  };

  const convertToMp3 = (starttime, endtime) => {
    setIsLoading(true);

    fetch("/api/convert/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ytid: youtubeID,
        starttime,
        endtime,
        title: youtubeTitle,
      }),
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("File not found");
        }
        return response.blob();
      })
      .then((data) => {
        download(
          data,
          `${youtubeTitle}.mp3`,
          "Content-Disposition: attachment"
        );
        goBackToStart();
      })
      .catch((err) => {
        setError(
          "File does not exists anymore, try again by refreshing the page"
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div style={{ textAlign: "center" }}>{error}</div>;
  }

  return (
    <>
      {!showVideo ? (
        <FormWrapper getVideo={getVideo} />
      ) : (
        <ConvertWrapper
          videolink={videolink}
          goBackToStart={goBackToStart}
          convertToMp3={convertToMp3}
        />
      )}
    </>
  );
};

export default HomePage;

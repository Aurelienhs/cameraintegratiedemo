import React from "react";
import { useRef, useState } from "react";
import styles from "./style.module.css";
//Iconen voor knoppen
import playIcon from "./playIcon.png";
import stopIcon from "./stopIcon.png";
import pauseIcon from "./pauseIcon.png";
import Countdown from "react-countdown";
import { useTimer } from "./Timer";
import Fileuploader from "./Fileuploader";

const Main = () => {
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef(null);
  const liveVideoFeed = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState(null);
  const [videoChunks, setVideoChunks] = useState([]);
  const [recordedVideo, setRecordedVideo] = useState(null);

  const { seconds, start, pause, stop } = useTimer();

  const getCameraPermission = async () => {
    setRecordedVideo(null);
    if ("MediaRecorder" in window) {
      try {
        const videoConstraints = {
          audio: true,
          video: true,
        };

        const audioConstraints = {
          audio: true,
        };
        // create audio and video streams separately
        const videoStream = await navigator.mediaDevices.getUserMedia(
          videoConstraints
        );
        const audioStream = await navigator.mediaDevices.getUserMedia(
          audioConstraints
        );

        setPermission(true);
        //combine both audio and video streams
        const combinedStream = new MediaStream([
          ...audioStream.getTracks(),
          ...videoStream.getTracks(),
        ]);

        setStream(combinedStream);
        //set videostream to live feed player
        liveVideoFeed.current.srcObject = videoStream;
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };
  const mimeType = "video/webm";
  const startRecording = async () => {
    setRecordingStatus("recording");
    if (!mediaRecorder.current) {
      const media = new MediaRecorder(stream, { mimeType });
      mediaRecorder.current = media;
    }
    if (mediaRecorder.current.state === "paused") {
      mediaRecorder.current.resume();
    } else {
      mediaRecorder.current.start();
    }
    start();
    let localVideoChunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localVideoChunks.push(event.data);
    };
    setVideoChunks(localVideoChunks);
  };

  const pauseRecording = async () => {
    setRecordingStatus("inactive");
    mediaRecorder.current.pause();
    pause();
  };

  const stopRecording = () => {
    stop();
    setPermission(false);
    setRecordingStatus("inactive");
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const videoBlob = new Blob(videoChunks, { type: mimeType });
      const videoUrl = URL.createObjectURL(videoBlob);
      setRecordedVideo(videoUrl);
      setVideoChunks([]);
    };
  };

  return (
    <div>
      <h2>Video Recorder</h2>
      <main position="relative">
        <div className="videocontrols">
          {!permission ? (
            <button
              className={styles.opencamerabutton}
              onClick={getCameraPermission}
              type="button"
            >
              Open camera
            </button>
          ) : null}
        </div>

        <div className={styles.videoplayer}>
          {!recordedVideo ? (
            <video
              ref={liveVideoFeed}
              autoPlay
              muted
              className={styles.liveplayer}
            ></video>
          ) : null}
          {permission && recordingStatus === "inactive" ? (
            <div>
              {seconds !== 0 ? <p className={styles.timer}>{seconds}</p> : null}
              <button
                onClick={() => setRecordingStatus("preparing")}
                type="button"
                className={styles.recordbutton}
              >
                <img
                  height="30em"
                  position="absolute"
                  src={playIcon}
                  alt="startRecording"
                ></img>
              </button>
            </div>
          ) : null}
          {recordingStatus === "preparing" ? (
            <div>
              {seconds !== 0 ? <p className={styles.timer}>{seconds}</p> : null}

              <Countdown
                onComplete={startRecording}
                className={styles.countdown}
                date={Date.now() + 3000}
              ></Countdown>
            </div>
          ) : null}
          {recordingStatus === "recording" ? (
            <div>
              <p className={styles.timer}>{seconds}</p>
              <button
                className={styles.pausebutton}
                onClick={pauseRecording}
                type="button"
              >
                <img height="30em" src={pauseIcon} alt="pauseRecording"></img>
              </button>
              <button
                className={styles.recordbutton}
                onClick={stopRecording}
                type="button"
              >
                <img height="30em" src={stopIcon} alt="stopRecording"></img>
              </button>
            </div>
          ) : null}
          {recordedVideo ? (
            <div className={styles.recordedplayer}>
              <video className="recorded" src={recordedVideo} controls></video>
              <a
                className={styles.opencamerabutton}
                download
                href={recordedVideo}
              >
                Download Recording
              </a>
              <Fileuploader />
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};
export default Main;

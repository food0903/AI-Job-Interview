import React, { useState } from "react";
import {
  Pagination,
  PaginationItem,
  Typography,
  TextField,
  Button
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { ReactMediaRecorder } from "react-media-recorder";
import Recorder from "./Recorder";
import axios from "axios";

function Homepage() {
  const [currentMessage, setCurrentMessage] = useState(''); 
  const [audioBlob, setAudioBlob] = useState(null); 
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState('');

  const submitJobDescription = () => {
    axios.post('http://localhost:8000/submit_job_description', {
      description: jobDescription}).then((response) => {
        console.log(jobDescription);
      })
      .catch((error) => {
        console.error("Error:", error); 
      });
  }
  const saveAudio = (audioBlob) => {
    setIsLoading(true);
    const myMessage = { sender: "me", audioBlob };
    const messageList = [...messages, myMessage];

    fetch(audioBlob)
      .then((res) => res.blob())
      .then(async (audioBlob) => {
        const formData = new FormData();
        formData.append("file", audioBlob, "audio.wav");
        await axios.post("http://localhost:8000/post_audio", formData, { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'arraybuffer' })
          .then((response) => {
            const blob = response.data;
            const audio = new Audio();
            audio.src = createBlobURL(blob);
            const responseAudio = { sender: "Celia", audioBlob: audio.src };
            messageList.push(responseAudio);
            setMessages(messageList);
            setIsLoading(false);
            audio.play();
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
  };

  function createBlobURL(data) {
    const blob = new Blob([data], { type: "audio/mpeg" });
    const url = window.URL.createObjectURL(blob);
    return url;
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center gap-4">
        <div className="w-1/5 h-96 rounded-2xl drop-shadow-lg bg-slate-100 relative p-4">
            <h1 className="font-bold text-2xl">Job Description</h1>
            <TextField
          sx={{ width: "100%", mt: 1 }}
          id="response"
          label="Job Description"
          onChange={(e) => setJobDescription(e.target.value)}
          multiline
          rows={10}
          defaultValue="Paste job description here..."
          inputProps={{ style: { fontSize: "0.8rem" } }}
        />
        <div className="w-full flex justify-center">
          <Button onClick={submitJobDescription} sx={{mt: 1}}variant="contained">Submit</Button>
        </div>

        </div>
      <div className="w-1/3 h-70 rounded-2xl drop-shadow-lg bg-slate-100 relative p-4">
        <Typography sx={{ fontWeight: "bold" }}>
          Question: Tell me about yourself
        </Typography>
        <TextField
          sx={{ width: "100%", mt: 1 }}
          id="response"
          label="Response"
          multiline
          rows={4}
          defaultValue="Default Value"
          inputProps={{ style: { fontSize: "0.8rem" } }}
        />

        <Pagination
          sx={{
            position: "absolute",
            bottom: 3,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
          count={5}
          renderItem={(item) => (
            <PaginationItem
              slots={{
                previous: ArrowBackIosNewIcon,
                next: ArrowForwardIosIcon,
              }}
              {...item}
            />
          )}
        />

        <div>
          <Recorder handleStop={saveAudio} />
        </div>
      </div>
    </div>
  );
}

export default Homepage;

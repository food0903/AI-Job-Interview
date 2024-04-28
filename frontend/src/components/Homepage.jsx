import React, { useState, useEffect, useRef } from "react";
import {
  Pagination,
  PaginationItem,
  Typography,
  TextField,
  Button, 
  Alert
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { ReactMediaRecorder } from "react-media-recorder";
import Recorder from "./Recorder";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";

function Homepage() {
  const [currentMessage, setCurrentMessage] = useState(''); 
  const [audioBlob, setAudioBlob] = useState(null); 
  const [messages, setMessages] = useState([]);
  const [botMessages, setBotMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [response, setResponse] = useState(null); 
  const [user] = useAuthState(auth);
  const [showAlert, setShowAlert] = useState(false);
  const [totalMessages, setTotalMessages] = useState([]);

  
  const prevMessages = useRef([]);
  const prevBotMessages = useRef([]);

    

  useEffect(() => {
    // Determine which dependency changed
    const changedMessages = messages !== prevMessages.current ? messages : null;
    const changedBotMessages = botMessages !== prevBotMessages.current ? botMessages : null;

    // Process the changed message
    let lastMessage = null;
    if (changedMessages !== null) {
        // Handle changed messages
        console.log('Messages changed:', changedMessages);  
        lastMessage = changedMessages.slice(-1)[0];
    }
    if (changedBotMessages !== null) {
        // Handle changed bot messages
        console.log('Bot messages changed:', changedBotMessages);
        lastMessage = changedBotMessages.slice(-1)[0];
        receiveMessageAudioOutput(lastMessage);
    }

    if (lastMessage !== null) {
        setTotalMessages(prevTotalMessages => [...prevTotalMessages, lastMessage]);
    }

    // Update previous values for the next comparison
    prevMessages.current = messages;
    prevBotMessages.current = botMessages;

}, [messages, botMessages]);


  useEffect(() => {
    if (jobDescription != "") {
      messageResponseFunction();
    }
  }, [messages])

  const submitJobDescription = () => {
    if (jobDescription.trim() === '') {
      // Show an alert or toast message indicating that the field is required
      setShowAlert(true);
      return; // Do not proceed with submission
    }
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
        await axios.post("http://localhost:8000/post_audio_and_get_text", formData, { headers: { 'Content-Type': 'multipart/form-data' }})
          .then((response) => {
            /*const blob = response.data;
            const audio = new Audio();
            audio.src = createBlobURL(blob);
            const responseAudio = { sender: "Celia", audioBlob: audio.src };
            messageList.push(responseAudio);
            setMessages(messageList);
            setIsLoading(false);
            audio.play();
            */  
            setMessages([...messages, user.displayName + ": " + response.data.response])
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
  };

  const messageResponseFunction = async () => {
    const messageInput = totalMessages.toString();
    console.log(messageInput);
    const response = await axios.post("http://localhost:8000/respond_message", { input_message: messageInput });
    console.log(response.data)
    setBotMessages([...botMessages, "Celia: " +  response.data])
  }

  function createBlobURL(data) {
    const blob = new Blob([data], { type: "audio/mpeg" });
    const url = window.URL.createObjectURL(blob);
    return url;
  }

  const receiveMessageAudioOutput = async (input) => {
    await axios.post("http://localhost:8000/text_to_speech", {input_message: input}, { responseType: 'arraybuffer' })
    .then((response) => {
      const blob = response.data;
      const audio = new Audio();
      audio.src = createBlobURL(blob);
      setIsLoading(false);
      console.log("audio ", audio);
      audio.play(); 
    })
    .catch((error) => { 
      console.error("Error:", error);
    });
  }
  return (
    <div className="w-full min-h-screen flex items-center justify-center gap-4">
        <div className="w-2/5 h-128 rounded-2xl drop-shadow-lg bg-slate-100 relative p-4">
            <h1 className="font-bold text-2xl">Job Description</h1>
            <TextField
          sx={{ width: "100%", mt: 1 }}
          id="response"
          placeholder="Job Description"
          onChange={(e) => setJobDescription(e.target.value)}
          multiline 
          rows={26}
          inputProps={{ style: { fontSize: "0.8rem" } }}
        />
       
        <div className="w-full flex justify-center">
          <Button onClick={submitJobDescription} sx={{mt: 1}}variant="contained">Submit</Button>
        </div>
        {showAlert && (
          <Alert severity="error" sx={{ mt: 1 }}>
            Please enter the job description.
          </Alert>
        )}

        </div>
      <div className="w-1/3 p-4 h-128 rounded-2xl drop-shadow-lg bg-slate-100 relative overflow-y-auto gap-4 flex flex-col">
        { totalMessages.map((message) => (
          <div className="p-2 bg-slate-300 drop-shadow-lg rounded-2xl">
            <Typography sx={{ fontWeight: "bold" }}>
              {message}
            </Typography>
        </div>
        ))}
      </div>
      <div className="ml-30">
          <Recorder handleStop={saveAudio} />
        </div>
    </div>
  );
}

export default Homepage;

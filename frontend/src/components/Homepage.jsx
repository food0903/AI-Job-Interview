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
  const [isSubmit, setIsSubmit] = useState(false);
  const [listOfAudio, setListOfAudio] = useState([]);

  
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

    if (lastMessage != null) {
        setTotalMessages(prevTotalMessages => [...prevTotalMessages, lastMessage]);
    }

    // Update previous values for the next comparison
    prevMessages.current = messages;
    prevBotMessages.current = botMessages;

    console.log('Total messages:', totalMessages);

}, [messages, botMessages]);


  useEffect(() => {
    if (jobDescription != "") {
      messageResponseFunction();
    }
  }, [messages])
  
  const clearResponsesAndTotalMessages = async () => {
      await clearResponses();
      messageResponseFunction();
      setTotalMessages([]);
      listOfAudio.forEach(audio => audio.pause());
      setIsSubmit(true);
  }

  const submitJobDescription = () => {
    if (jobDescription.trim() === '') {
      // Show an alert or toast message indicating that the field is required
      setShowAlert(true);
      return; // Do not proceed with submission
    }
    
    axios.post('http://localhost:8080/set_job_description_for_user', {
      text: jobDescription, uid: user.uid}).then((response) => {
        console.log(jobDescription);
        clearResponsesAndTotalMessages();
        setIsSubmit(true);
      })
      .catch((error) => {
        console.error("Error:", error); 
      });
  }
  const saveAudio = (audioBlob) => {
    setIsLoading(true);
    listOfAudio.forEach(audio => audio.pause());
    const myMessage = { sender: "me", audioBlob };
    const messageList = [...messages, myMessage];

    console.log(audioBlob);
    fetch(audioBlob)
      .then((res) => res.blob())
      .then(async (audioBlob) => {
        const formData = new FormData();
        formData.append("file", audioBlob, "audio.wav");
        axios.post("http://localhost:8080/transcribe_text/", formData, { headers: { 'Content-Type': 'multipart/form-data' }})
          .then((response) => {
           axios.post("http://localhost:8080/add_message", { uid: user.uid, content: response.data.text, role: "user" })
            setMessages([...messages, user.displayName + ": " + response.data.text])
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
  };

  const messageResponseFunction = async () => {

    console.log("messages:", messages);
    const response = await axios.post("http://localhost:8080/fetch_response", { uid: user.uid });
    console.log(response.data)
    await axios.post("http://localhost:8080/add_message", { uid: user.uid, content: response.data, role: "assistant" })
    setBotMessages([...botMessages, "Celia: " +  response.data])
  }

  function createBlobURL(data) {
    const blob = new Blob([data], { type: "audio/mpeg" });
    const url = window.URL.createObjectURL(blob);
    return url;
  }

  const receiveMessageAudioOutput = async (text) => {
    await axios.post("http://localhost:8080/text_to_speech", {text}, { responseType: 'arraybuffer' })
    .then((response) => {
      const blob = response.data;
      const audio = new Audio();
      audio.src = createBlobURL(blob);
      setIsLoading(false);
      console.log("audio ", audio);
      audio.play(); 

      setListOfAudio([...listOfAudio, audio]);
    })
    .catch((error) => { 
      console.error("Error:", error);
    });
  }

  const clearResponses = async () => {
    try {
        const response = await axios.delete(`http://localhost:8080/delete_messages/${user.uid}`);
        console.log(response.data.message);
        // Optionally, you can update the state or perform other actions after clearing responses
    } catch (error) {
        console.error("Error:", error);
    }
}

useEffect(() => {
    if (totalMessages.length === 0) {
        clearResponses();
    }
}, [totalMessages]);
  return (
    <div className="w-full h-screen min-h-screen flex items-center justify-start gap-4">
        <div className="w-2/5 h-full p-4 rounded-2xl drop-shadow-lg bg-slate-100 relative">
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
      <div className="w-128 p-4 h-full rounded-2xl drop-shadow-lg bg-slate-100 relative overflow-y-auto gap-4 flex flex-col">
        { totalMessages.map((message) => (
          <div className="p-2 bg-slate-300 drop-shadow-lg rounded-2xl">
            <Typography sx={{ fontWeight: "bold" }}>
              {message}
            </Typography>
        </div>
        ))}
      </div>
      <div className="ml-30">
        {isSubmit ?
          <Recorder handleStop={saveAudio} />
          : <div>Submit a job description!</div>
        }
          
        </div>
    </div>
  );
}

export default Homepage;

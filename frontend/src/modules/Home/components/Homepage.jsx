import React, { useState, useEffect, useRef } from "react";
import {
  Pagination,
  PaginationItem,
  Typography,
  TextField,
  Button,
  Alert,
  Avatar
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { auth } from "../../../firebase";
import Recorder from "./Recorder";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import SidebarLayout from "../../Common/component/SidebarLayout";
import { CircularProgress} from "@mui/material";
import { motion } from "framer-motion"
import { useCreateSession } from "../../Common/hooks/useCreateSession";
import { useSetJobDescription } from "../../Home/hooks/useSetJobDescription";
import { useAddMessage } from "../../Home/hooks/useAddMessage";
import { useFetchResponse } from "../../Home/hooks/useFetchResponse";
import { useTranscribeText } from "../../Home/hooks/useTranscribeText";
import { useTextToSpeech } from "../../Home/hooks/useTextToSpeech";
import Message from "./Message";
function Homepage() {
  const [messages, setMessages] = useState([]);
  const [botMessages, setBotMessages] = useState([]);
  const [jobDescription, setJobDescription] = useState('');
  const [user] = useAuthState(auth);
  const [showAlert, setShowAlert] = useState(false);
  const [totalMessages, setTotalMessages] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [listOfAudio, setListOfAudio] = useState([]);
  const [conversationClearLoading, setConversationClearLoading] = useState(false);
  const [sessionID, setSessionID] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Added state for isLoading


  const chatRef = useRef(null);
  const prevMessages = useRef([]);
  const prevBotMessages = useRef([]);

  // Use custom hooks
  const { createSession } = useCreateSession(user?.uid);
  const { setJobDescriptionForUser, loading: setJobLoading } = useSetJobDescription();
  const { addMessage } = useAddMessage();
  const { fetchResponse } = useFetchResponse();
  const { transcribeText } = useTranscribeText();
  const { textToSpeech } = useTextToSpeech();


  useEffect(() => {
    // Determine which dependency changed
    const changedMessages = messages !== prevMessages.current ? messages : null;
    const changedBotMessages = botMessages !== prevBotMessages.current ? botMessages : null;

    // Process the changed message
    let lastMessage = null;
    if (changedMessages != null) {
      // Handle changed messages
      console.log('Messages changed:', changedMessages);
      lastMessage = changedMessages.slice(-1)[0];
    }
    if (changedBotMessages != null) {
      // Handle changed bot messages
      console.log('Bot messages changed:', changedBotMessages);
      lastMessage = changedBotMessages.slice(-1)[0];
      if (lastMessage != null) {
        receiveMessageAudioOutput(lastMessage.content);
      }
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
    if (sessionID) messageResponseFunction();
  }, [messages])



  useEffect(() => {
    chatRef.current && chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [totalMessages]);

  const clearResponsesAndTotalMessages = async () => {
    setConversationClearLoading(false);
    setTotalMessages([]);
    setJobDescription('');
    listOfAudio.forEach(audio => audio.pause());
    setConversationClearLoading(true);
  }

  const submitJobDescription = async () => {
    if (jobDescription.trim() === '') {
      // Show an alert or toast message indicating that the field is required
      setShowAlert(true);
      return; // Do not proceed with submission
    }

    try {
      const sid = await createSession(); // Changed to use createSession hook
      setSessionID(sid);
      await setJobDescriptionForUser(jobDescription, user.uid, sid); // Changed to use setJobDescriptionForUser hook
      clearResponsesAndTotalMessages();
      messageResponseFunction(sid);
      setIsSubmit(true);
    } catch (error) {
      console.error("Error:", error);
    }

  }
  const saveAudio = async (audioBlob) => {
    setIsLoading(true);
    listOfAudio.forEach(audio => audio.pause());
    const myMessage = { sender: "me", audioBlob };
    const messageList = [...messages, myMessage];

    try {
      const transcribedText = await transcribeText(audioBlob); // Changed to use transcribeText hook
      await addMessage(user.uid, transcribedText, "user", sessionID); // Changed to use addMessage hook
      setMessages([...messages, { role: "User", content: transcribedText }]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  

  const messageResponseFunction = async (sid = sessionID) => {
    try {
      const response = await fetchResponse(sid); // Changed to use fetchResponse hook
      await addMessage(user.uid, response, "assistant", sid); // Changed to use addMessage hook
      setBotMessages([...botMessages, { role: "Celia", content: response }]);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function createBlobURL(data) {
    const blob = new Blob([data], { type: "audio/mpeg" });
    const url = window.URL.createObjectURL(blob);
    return url;
  }

  const receiveMessageAudioOutput = async (text) => {
    try {
      const audioData = await textToSpeech(text); // Changed to use textToSpeech hook
      const audio = new Audio();
      audio.src = createBlobURL(audioData);
      setIsLoading(false);
      isSubmit && audio.play();
      setListOfAudio([...listOfAudio, audio]);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  
  return (
    <SidebarLayout selectedTab="Celia">
      <div className="w-full h-full flex relative items-center justify-center gap-x-4 overflow-hidden">
        {!isSubmit &&
          <div className="w-[600px] h-auto p-4 rounded-2xl drop-shadow-lg bg-slate-100 items-center flex flex-col relative overflow-y-auto no-scrollbar">
              <div className="flex flex-row justify-start gap-x-2 items-center">
                <Avatar src="/Celia.jpg" sx={{ bgcolor: "purple" }}></Avatar>
                <div className="p-2 bg-blue-500 max-w-[600px] drop-shadow-lg rounded-2xl">
                  <Typography sx={{ color: "white", fontFamily: "nunito" }}>
                    Hi! I'm Celia, your virtual job interviewer. To get started, please provide a job description.
                    You can copy and paste any job description from any listing you find online or you can write
                    a brief summary of any job description.
                  </Typography>
                </div>
              </div>

            <TextField
              sx={{ width: "100%", mt: 2 }}
              id="response"
              placeholder="Input your job description here..."
              onChange={(e) => setJobDescription(e.target.value)}
              multiline
              rows={10}
              inputProps={{ style: { fontSize: "0.8rem"} }}
              
            />

            <div className="w-full flex justify-center">
              <Button onClick={submitJobDescription} disabled={isSubmit} sx={{ mt: 2, borderRadius: "10px", fontFamily: "nunito", backgroundColor: "rgb(59 130 246)" }} variant="contained">
                { setJobLoading ? <CircularProgress size={24} sx={{color:'white'}} />:'Submit'}
              </Button>
            </div>
            {showAlert && (
              <Alert severity="error" sx={{ mt: 1 }}>
                Please enter the job description.
              </Alert>
            )}

          </div>
        }
        {isSubmit &&  
          <div className="w-full h-full overflow-hidden">
            <div ref={chatRef} className="w-[100%] h-[90%] p-2 gap-4 flex flex-col overflow-y-auto no-scrollbar">
              {conversationClearLoading &&
                <>
                  {
                    totalMessages.map((message, index) => (
                        <Message key={index} message={message} />
                    ))
                  }
                </>
              }

            </div>
              <div className="flex justify-center h-[5.5rem] bg-[#FFFFFF] sticky bottom-0 gap-x-4 items-center">
              <button
                  className="flex h-[4rem] w-[4rem] bg-white outline-none rounded-full items-center justify-center drop-shadow-md"
                  onClick={() => { setIsSubmit(false); clearResponsesAndTotalMessages(); }}
                >
                  <ArrowBackIosNewIcon />
                </button>
                <Recorder handleStop={saveAudio} />
                
              </div>


        </div>
       

        }

      </div>
    </SidebarLayout>
  );
}

export default Homepage;

import SidebarLayout from "../../Common/component/SidebarLayout";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase";
import HistoryMessageComponent from "./HistoryMessageComponent";
import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { Avatar, Typography, Button, CircularProgress, Box } from "@mui/material";
import { motion } from "framer-motion";
import DeleteIcon from '@mui/icons-material/Delete';
import ShowJobDescriptionModal from "./ShowJobDescriptionModal";

import { useClearResponses } from "../hooks/useClearResponses"; 
import { useGenerateFeedback } from "../hooks/useGenerateFeedback"; 
import { useGetAllSessions } from "../hooks/useGetAllSessions"; 
import { useGetMessageBasedOnSessionID } from "../hooks/useGetMessageBasedOnSessionID";
import Message from "./Message";

export default function HistoryPage() {
    const [user] = useAuthState(auth);
    const [messageHistory, setMessageHistory] = useState([]);
    const [sessionID, setSessionID] = useState("");
    const [messageContents, setMessageContents] = useState([]);
    const [messagesLoaded, setMessagesLoaded] = useState(false);
    const [feedback, setFeedback] = useState({});
    const [jobDescription, setJobDescription] = useState("");
    const [showJobDescriptionModal, setShowJobDescriptionModal] = useState(false);
    const [sessionsLoaded, setSessionsLoaded] = useState(false);

    const { clearResponses, loading: loadingDelete } = useClearResponses(); 
    const { generateFeedback, loading: loadingFeedback } = useGenerateFeedback(); 
    const { getAllSessions } = useGetAllSessions(); 
    const { getMessageBasedOnSessionID } = useGetMessageBasedOnSessionID(); 

    const handleClearResponses = async () => {
        try {
            const response = await clearResponses(user.uid); 
            setSessionID("");
            setMessageContents([]);
            setMessageHistory([]);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const handleGenerateFeedback = async () => {
        try {
            const feedbackData = await generateFeedback(sessionID); // Using custom hook function
            setFeedback({...feedback, [sessionID]: feedbackData});
        } catch (error) {
            console.error("Error:", error);
        } 
    }


    const handleGetAllSessions = async () => {
        try {
            setSessionsLoaded(false);
            const sessions = await getAllSessions(user.uid); // Using custom hook function
            setMessageHistory(sessions);
            setSessionsLoaded(true);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const handleGetMessageBasedOnSessionID = async () => {
        setMessagesLoaded(false);
        try {
            const sessionDetails = await getMessageBasedOnSessionID(sessionID);
            setFeedback({...feedback, [sessionID]: sessionDetails.feedback});
            setMessageContents(sessionDetails.messages);
            setJobDescription(sessionDetails.job_description);
            setMessagesLoaded(true);
        } catch (error) {
            console.error("Error:", error);
        }

    }

    useEffect(() => {
        console.log(sessionID);
        handleGetMessageBasedOnSessionID();
    }, [sessionID])

    useEffect(() => {
        if (user) handleGetAllSessions();
    }, [user?.uid]);

    return (
        <SidebarLayout selectedTab="History">
            <ShowJobDescriptionModal jobDescription={jobDescription} open={showJobDescriptionModal} handleClose={() => setShowJobDescriptionModal(false)} />
            <div className="w-full h-full flex justify-center ">
                <div className="w-1/5 overflow-x-hidden flex flex-col border-r-2">
                {sessionsLoaded ? 
                    <div className="w-full p-2 gap-2 bg-white overflow-x-hidden flex flex-col rounded-s-xl h-full overflow-y-auto no-scrollbar">
                      
                 
                        {messageHistory && messageHistory.map((message) => (
                            <HistoryMessageComponent key = {message.sid} sid={message.sid} setSidState={setSessionID} jobDescription={message.job_description} timestamp={message.timestamp} />
                        ))}
                        
                    </div> 
                     : <div className="justify-center flex w-full h-full items-center">
                     <CircularProgress size={96} />
                    </div> 
                 }

                    <div className="block mx-auto mt-2">
                        <Button onClick={handleClearResponses} startIcon={<DeleteIcon />} variant="contained" sx={{ backgroundColor: "#d32f2f", color: "white", fontFamily: "nunito", '&:hover': { backgroundColor: '#e95858' } }}>
                            {loadingDelete ? <CircularProgress size ={24} sx={{color: 'white'}}/> : 'Delete All'}
                        </Button>
                    </div>
                </div>
                <div className="w-4/5 bg-white h-full flex rounded-r-xl drop-shadow-sm overflow-y-auto no-scrollbar p-2">
                    <div className="w-full p-3 h-full overflow-y-auto drop-shadow-md">

                        {messagesLoaded && <>
                            <motion.div
                                initial={{ x: '70vw' }}
                                animate={{ x: 0 }}
                                transition={{ type: 'tween', duration: 0.25 }}
                                className="flex flex-row p-2 justify-end gap-x-2 items-center">
                                <div className="p-2 bg-slate-200 max-w-[500px] drop-shadow-lg rounded-2xl">
                                <Button fullWidth onClick={() => setShowJobDescriptionModal(true)} sx={{ color: "black", borderRadius: "10px", fontFamily: "nunito", backgroundColor: "#e6e6e6", '&:hover': { backgroundColor: '#bfbdbd' } }} variant="contained">View job description</Button> 
                                </div>
                                <Avatar src={user?.photoURL} sx={{ bgcolor: "purple" }}></Avatar>
                            </motion.div>
                            {messageContents.map((message, index) => (
                                <div className="p-2 gap-4 flex flex-col no-scrollbar">
                                    <Message key={index} message={message} />
                                </div>
                            ))}
                            <motion.div
                                initial={{ x: '-20vw' }}
                                animate={{ x: 0 }}
                                transition={{ type: 'tween', duration: 0.25 }}
                                className="flex p-2 flex-row justify-start gap-x-2 items-center">
                                <Avatar src="/Celia.jpg" sx={{ bgcolor: "purple" }}></Avatar>
                                <div className="p-2 bg-blue-500 max-w-[500px] drop-shadow-lg rounded-2xl">
                                    {!feedback[sessionID] ?
                                        <Button disabled={loadingFeedback} onClick={handleGenerateFeedback} sx={{ borderRadius: "10px", fontFamily: "nunito", backgroundColor: "#3565f2" }} variant="contained">
                                            {loadingFeedback ? <CircularProgress size={24} sx={{color:'white'}} /> : 'Generate feedback'}
                                        </Button>
                                        :
                                        <div>
                                            <Typography sx={{ color: "white", fontFamily: "nunito" }}>
                                                <b>Feedback:</b> {feedback[sessionID]}
                                            </Typography>
                                            <Button fullWidth disabled={loadingFeedback} onClick={handleGenerateFeedback} sx={{ mt: 1, borderRadius: "10px", fontFamily: "nunito", backgroundColor: "#3565f2" }} variant="contained">
                                                {loadingFeedback ? <CircularProgress size={24} sx={{color:'white'}} /> : <>
                                                Generate Feedback</> }
                                                    
                                            </Button>
                                        </div>

                                    }
                                </div>

                            </motion.div>
                        </>
                        }


                    </div>



                </div>
            </div>
        </SidebarLayout>
    );
}
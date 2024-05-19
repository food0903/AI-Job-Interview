import SidebarLayout from "../components/SidebarLayout";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import HistoryMessageComponent from "./HistoryMessageComponent";
import axios from "axios";
import { useEffect, useState } from "react";
import { Avatar, Typography, Button, CircularProgress, Box } from "@mui/material";
import { motion } from "framer-motion";
import DeleteIcon from '@mui/icons-material/Delete';
import ShowJobDescriptionModal from "./ShowJobDescriptionModal";

export default function HistoryPage() {
    const [user] = useAuthState(auth);
    const [messageHistory, setMessageHistory] = useState([]);
    const [sessionID, setSessionID] = useState("");
    const [messageContents, setMessageContents] = useState([]);
    const [messagesLoaded, setMessagesLoaded] = useState(false);
    const [feedback, setFeedback] = useState({});
    const [loadingFeedback, setLoadingFeedback] = useState(false);
    const [jobDescription, setJobDescription] = useState("");
    const [showJobDescriptionModal, setShowJobDescriptionModal] = useState(false);

    const clearResponses = async () => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_PUBLIC_API_URL}/delete_sessions/${user.uid}`);
            setSessionID("");
            setMessageContents([]);
            setMessageHistory([]);
            console.log(response.data.message);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const generateFeedback = async () => {
        try {
            setLoadingFeedback(true);
            const response = await axios.post(`${import.meta.env.VITE_PUBLIC_API_URL}/get_feedback_from_session`, { sid: sessionID });
            setFeedback({...feedback, [sessionID]: response.data});
            setLoadingFeedback(false);
        } catch (error) {
            console.error("Error:", error);
        }
    }


    const getAllSessions = () => {
        axios.post(`${import.meta.env.VITE_PUBLIC_API_URL}/get_all_sessions`, { uid: user.uid })
            .then((response) => {
                setMessageHistory(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const getMessageBasedOnSessionID = () => {
        setMessagesLoaded(false);
        if (sessionID) {
            axios.post(`${import.meta.env.VITE_PUBLIC_API_URL}/get_sid_details`, { sid: sessionID })
                .then(async (response) => {
                    setMessagesLoaded(false);
                    setFeedback({...feedback, [sessionID]: response.data.feedback});
                    setMessageContents(response.data.messages);
                    setJobDescription(response.data.job_description);
                    console.log(response.data);
                    setMessagesLoaded(true);
                })
                .catch((error) => {
                    console.log(error);
                });
        }

    }

    useEffect(() => {
        console.log(sessionID);
        getMessageBasedOnSessionID();
    }, [sessionID])

    useEffect(() => {
        if (user) getAllSessions();
    }, [user?.uid]);

    return (
        <SidebarLayout selectedTab="History">
            <ShowJobDescriptionModal jobDescription={jobDescription} open={showJobDescriptionModal} handleClose={() => setShowJobDescriptionModal(false)} />
            <div className="w-full h-full flex justify-center ">
                <div className="w-1/5 overflow-x-hidden flex flex-col border-r-2">
                    <div className="w-full p-2 gap-2 bg-white overflow-x-hidden flex flex-col rounded-s-xl h-full overflow-y-auto no-scrollbar">
                        {messageHistory && messageHistory.map((message) => (
                            <HistoryMessageComponent sid={message.sid} setSidState={setSessionID} jobDescription={message.job_description} timestamp={message.timestamp} />
                        ))}
                    </div>
                    <div className="block mx-auto mt-2">
                        <Button onClick={clearResponses} startIcon={<DeleteIcon />} variant="contained" sx={{ backgroundColor: "#d32f2f", color: "white", fontFamily: "nunito", '&:hover': { backgroundColor: '#e95858' } }}>Delete All</Button>
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
                            {messageContents.map((message) => (
                                <div className="p-2 gap-4 flex flex-col no-scrollbar">
                                    {message.role == "assistant" &&
                                        <motion.div
                                            initial={{ x: '-20vw' }}
                                            animate={{ x: 0 }}
                                            transition={{ type: 'tween', duration: 0.25 }}
                                            className="flex flex-row justify-start gap-x-2 items-center">
                                            <Avatar src="/Celia.jpg" sx={{ bgcolor: "purple" }}></Avatar>
                                            <div className="p-2 bg-blue-500 max-w-[500px] drop-shadow-lg rounded-2xl">
                                                <Typography sx={{ color: "white", fontFamily: "nunito" }}>
                                                    {message.content}
                                                </Typography>
                                            </div>

                                        </motion.div>
                                    }

                                    {message.role === "user" &&
                                        <motion.div
                                            initial={{ x: '70vw' }}
                                            animate={{ x: 0 }}
                                            transition={{ type: 'tween', duration: 0.25 }}
                                            className="flex flex-row justify-end gap-x-2 items-center">
                                            <div className="p-2 bg-slate-200 max-w-[500px] drop-shadow-lg rounded-2xl">
                                                <Typography sx={{ fontFamily: "nunito" }}>
                                                    {message.content}
                                                </Typography>
                                            </div>
                                            <Avatar src={user?.photoURL} sx={{ bgcolor: "purple" }}></Avatar>
                                        </motion.div>
                                    }


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
                                        <Button disabled={loadingFeedback} onClick={generateFeedback} sx={{ borderRadius: "10px", fontFamily: "nunito", backgroundColor: "#3565f2" }} variant="contained">Generate feedback</Button>
                                        :
                                        <div>
                                            <Typography sx={{ color: "white", fontFamily: "nunito" }}>
                                                <b>Feedback:</b> {feedback[sessionID]}

                                            </Typography>
                                            <Button fullWidth disabled={loadingFeedback} onClick={generateFeedback} sx={{ mt: 1, borderRadius: "10px", fontFamily: "nunito", backgroundColor: "#3565f2" }} variant="contained">Regenerate feedback</Button>
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
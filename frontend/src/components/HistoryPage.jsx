import SidebarLayout from "../components/SidebarLayout";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import HistoryMessageComponent from "./HistoryMessageComponent";
import axios from "axios";
import { useEffect, useState } from "react";
import { Avatar, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import DeleteIcon from '@mui/icons-material/Delete';


export default function HistoryPage() {
    const [user] = useAuthState(auth);
    const [messageHistory, setMessageHistory] = useState([]);
    const [sessionID, setSessionID] = useState("");
    const [messageContents, setMessageContents] = useState([]);
    const [messagesLoaded, setMessagesLoaded] = useState(false);

    const clearResponses = async () => {
        try {
            const response = await axios.delete(`http://localhost:8080/delete_sessions/${user.uid}`);
            setSessionID("");
            setMessageContents([]);
            setMessageHistory([]);
            console.log(response.data.message);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const getAllSessions = () => {
        axios.post("http://localhost:8080/get_all_sessions", { uid: user.uid })
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
            axios.post("http://localhost:8080/get_all_messages_based_off_sid", { sid: sessionID })
                .then((response) => {
                    setMessageContents(response.data);
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
            <div className="w-full h-full flex justify-center ">
                <div className="w-1/5 overflow-x-hidden flex flex-col border-r-2">
                    <div className="w-full p-2 gap-2 bg-white overflow-x-hidden flex flex-col  rounded-s-xl h-full overflow-y-auto no-scrollbar">
                        {messageHistory && messageHistory.map((message) => (
                            <HistoryMessageComponent sid={message.sid} setSidState={setSessionID} jobDescription={message.job_description} timestamp={message.timestamp}/>
                        ))}
                    </div>
                    <div className="block mx-auto mt-2">
                        <Button onClick={clearResponses} startIcon={<DeleteIcon/>} variant="contained" sx={{ backgroundColor: "#d32f2f", color: "white", fontFamily: "nunito", '&:hover': { backgroundColor: '#e95858' } }}>Delete All</Button>
                    </div>
                </div>
                <div>
                    
                </div>
                <div className="w-4/5 bg-white h-full rounded-r-xl drop-shadow-sm overflow-y-auto no-scrollbar p-2">
                    <div className="w-full h-full overflow-hidden">
                    {messagesLoaded && <>
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
                    </>
                    }


                    </div>



                </div>
            </div>
        </SidebarLayout>
    );
}
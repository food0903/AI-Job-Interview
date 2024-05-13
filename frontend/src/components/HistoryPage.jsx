import SidebarLayout from "../components/SidebarLayout";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import HistoryMessageComponent from "./HistoryMessageComponent";
import axios from "axios";
import { useEffect, useState } from "react";
import { Avatar, Typography } from "@mui/material";



export default function HistoryPage() {
    const [user] = useAuthState(auth);
    const [messageHistory, setMessageHistory] = useState([]);
    const [sessionID, setSessionID] = useState("");
    const [messageContents, setMessageContents] = useState([]);

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
        if (sessionID) {

            axios.post("http://localhost:8080/get_all_messages_based_off_sid", { sid: sessionID })
                .then((response) => {
                    setMessageContents(response.data);
                    console.log(response.data);
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
            <div className="w-full h-full flex ">
                <div className="w-1/5 bg-white overflow-x-hidden drop-shadow-sm rounded-s-xl h-full overflow-y-auto no-scrollbar">
                    {messageHistory && messageHistory.map((message) => (
                        <HistoryMessageComponent sid={message.sid} setSidState={setSessionID} jobDescription={message.job_description} />
                    ))}
                </div>
                <div className="w-4/5 bg-white h-full rounded-r-xl border drop-shadow-sm p-2">
                    {messageContents.map((message) => (
                        <div className="p-2 gap-4 flex flex-col overflow-y-auto no-scrollbar">
                            {message.role == "assistant" &&
                                <div className="flex flex-row justify-start gap-x-2 items-center">
                                    <Avatar src="/Celia.jpg" sx={{ bgcolor: "purple" }}></Avatar>
                                    <div className="p-2 bg-blue-500 max-w-[500px] drop-shadow-lg rounded-2xl">
                                        <Typography sx={{ color: "white", fontFamily: "nunito" }}>
                                            {message.content}
                                        </Typography>
                                    </div>

                                </div>
                            }

                            {message.role === "user" &&
                                <div className="flex flex-row justify-end gap-x-2 items-center">
                                    <div className="p-2 bg-slate-200 max-w-[500px] drop-shadow-lg rounded-2xl">
                                        <Typography sx={{ fontFamily: "nunito" }}>
                                            {message.content}
                                        </Typography>
                                    </div>
                                    <Avatar src={user?.photoURL} sx={{ bgcolor: "purple" }}></Avatar>
                                </div>
                            }

                        </div>
                    ))}






                </div>
            </div>
        </SidebarLayout>
    );
}
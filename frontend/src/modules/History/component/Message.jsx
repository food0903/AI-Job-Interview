import { Avatar, Typography } from '@mui/material';
import { motion } from "framer-motion";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase";

export default function Message({ message }) {

    const [user] = useAuthState(auth);
    return (
        <>
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


        </>
    )
}
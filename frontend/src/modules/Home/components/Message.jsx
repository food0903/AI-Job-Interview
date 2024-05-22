import { Typography, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { auth } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Message({ message }) {

    const [user] = useAuthState(auth);
    
    return (
        <>
            {message.role === "User" &&
                <motion.div
                    initial={{ x: '80vw' }}
                    animate={{ x: 0 }}
                    transition={{ type: 'tween', duration: 0.25 }}
                    className="flex flex-row justify-end gap-x-2 items-center">
                    <div className="p-2 bg-slate-200 max-w-[800px] drop-shadow-lg rounded-2xl">
                        <Typography sx={{ fontFamily: "nunito" }}>
                            {message.content}
                        </Typography>
                    </div>
                    <Avatar src={user.photoURL} sx={{ bgcolor: "purple" }}></Avatar>
                </motion.div>
            }
            {message.role === "Celia" &&
                <motion.div
                    initial={{ x: '-20vw' }}
                    animate={{ x: 0 }}
                    transition={{ type: 'tween', duration: 0.25 }}
                    className="flex flex-row justify-start gap-x-2 items-center">
                    <Avatar src="/Celia.jpg" sx={{ bgcolor: "purple" }}></Avatar>
                    <div className="p-2 bg-blue-500 max-w-[800px] drop-shadow-lg rounded-2xl">
                        <Typography sx={{ color: "white", fontFamily: "nunito" }}>
                            {message.content}
                        </Typography>
                    </div>

                </motion.div>
            }
        </>
    )
}
import { motion } from "framer-motion";

export default function HistoryMessageComponent({sid, setSidState, jobDescription, timestamp}) {
    const day = new Date(timestamp).toLocaleDateString("en-US")
    const time = new Date(timestamp).toLocaleTimeString("en-US", {hour: '2-digit', minute: '2-digit'})

    return (
        <motion.div 
            whileHover={{ scale: 1.03 }}
            onClick={() => setSidState(sid)} 
       
            
            className="hover:cursor-pointer w-full h-auto bg-white rounded-xl border-1 drop-shadow-lg font-nunito p-3">
            <span className="line-clamp-2 font-semibold">{jobDescription}</span>
            
            <span className="text-slate-600 text-sm">{day} {time}</span>
        </motion.div>
    );
}
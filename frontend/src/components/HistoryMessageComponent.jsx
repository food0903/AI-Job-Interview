
export default function HistoryMessageComponent({sid, setSidState, jobDescription, timestamp}) {
    const day = new Date(timestamp).toLocaleDateString("en-US")
    const time = new Date(timestamp).toLocaleTimeString("en-US", {hour: '2-digit', minute: '2-digit'})

    return (
        <div onClick={() => setSidState(sid)} className="hover:cursor-pointer w-full h-24 bg-white rounded-xl border-1 drop-shadow-sm font-nunito p-2">
            <span className="line-clamp-2 font-bold">{jobDescription}</span>
            
            <span>{day} {time}</span>
        </div>
    );
}
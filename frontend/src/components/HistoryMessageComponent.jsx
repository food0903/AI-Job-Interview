
export default function HistoryMessageComponent({sid, setSidState, jobDescription}) {
    return (
        <div onClick={() => setSidState(sid)} className="w-full h-24 border-1 overflow-hidden font-nunito p-2">
            <p className="line-clamp-2">{jobDescription}</p>
        </div>
    );
}
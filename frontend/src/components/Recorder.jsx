import React from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'tailwindcss/tailwind.css';

function Recorder({ handleStop}) {

    return (
    <ReactMediaRecorder
        audio
        onStop={handleStop}
        render={({ status, startRecording, stopRecording }) => (
        <div>
            <button
                onClick={status == "recording" ? stopRecording : startRecording} 
                className="flex bg-white h-[4rem] w-[4rem] outline-none drop-shadow-md rounded-full items-center justify-center shadow-lg"
            >
                {status == "recording" ? <i className="bi bi-mic text-red-500 text-2xl"></i> : <i className="bi bi-mic text-black text-2xl"></i>}
            </button>
        </div>
        )} 
        />
    );
};

export default Recorder;
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
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                className="flex bg-white h-[6rem] w-[6rem] rounded-full items-center justify-center shadow-lg"
            >
                <i className="bi bi-mic text-black text-6xl"></i>
            </button>
            <p>{status}</p>
        </div>
        )} 
        />
    );
};

export default Recorder;
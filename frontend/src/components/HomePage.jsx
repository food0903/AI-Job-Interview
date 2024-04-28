import React, { useState } from 'react';
import '../css/HomePage.css';
import Recorder from './Recorder';
import axios from 'axios';
// Sidebar for chat history
const HomePage = () => {

const Sidebar = ({ chatHistory }) => (
  <div className="sidebar">
    <h2>Chat History</h2>
    <ul>
      {chatHistory.map((msg, index) => (
        <li key={index}>{msg}</li>
      ))}
    </ul>
  </div>
);

// Main chat box
const ChatBox = ({ currentMessage, setCurrentMessage, sendMessage }) => (
  <div className="chatbox">
    <div className="content">
      <audio src = {audioBlob} controls/>
    </div>
    <div className="input-section">
      <input
        type="text"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
        placeholder="Type a message..."
      />
    </div>
  </div>
);

// Main HomePage component
  const [chatHistory, setChatHistory] = useState([]);
  const [currentMessage, setCurrentMessage] = useState(''); // Correct useState initialization
  const [audioBlob, setAudioBlob] = useState(null);  // Store audio blob
  const [messages, setMessages] = useState([]); // Store messages
  const [isLoading, setIsLoading] = useState(false); // Loading state


  
  const saveAudio = (audioBlob) => {
    setIsLoading(true);
    const myMessage = { sender: "me", audioBlob };
    const messageList = [...messages, myMessage];

    fetch(audioBlob)
  .then((res) => res.blob())
  .then(async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.wav");
    await axios.post("http://localhost:8000/post_audio", formData, {headers: {'Content-Type': 'multipart/form-data'}, responseType: 'arraybuffer'})
    .then((response) => {
      const blob = response.data;
    const audio = new Audio();
  audio.src = createBlobURL(blob);
  const responseAudio = { sender: "Chun Chan", audioBlob: audio.src};
  messageList.push(responseAudio);
  setMessages(messageList);
  setIsLoading(false);
  audio.play();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  });
};

  function createBlobURL(data) {
    const blob = new Blob([data], { type: "audio/mpeg" });
    const url = window.URL.createObjectURL(blob);
    return url;
  }
  
  const sendMessage = () => {
    if (currentMessage.trim() !== '') {
      setChatHistory([...chatHistory, currentMessage]);
      setCurrentMessage(''); // Clear input after sending
    }
  };


  return (
    <div className="flex flex-col h-screen bg-blue-50">
      <div className="navbar"> {/* Navy blue banner */}
        <div className="logo-placeholder"> {/* Logo placeholder */}
          <img src="/src/assets/CompanyLogo.png" alt="Company Logo" className="rounded-full" />
        </div>
      </div>

      <div className="flex flex-row flex-1"> {/* Main content */}
        <Sidebar chatHistory={chatHistory} /> {/* Sidebar */}

        <div className="flex-1 p-4 bg-blue-50"> {/* Main chat box */}
        
          <ChatBox
            currentMessage={currentMessage}
            setCurrentMessage={setCurrentMessage}
            sendMessage={sendMessage}
          />
            <Recorder handleStop={saveAudio}/>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

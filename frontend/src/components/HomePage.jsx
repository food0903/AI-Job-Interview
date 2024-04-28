import React, { useState } from 'react';
import '../css/HomePage.css';
import Recorder from './Recorder';
// Sidebar for chat history
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
const HomePage = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [currentMessage, setCurrentMessage] = useState(''); // Correct useState initialization
  const [audioBlob, setAudioBlob] = useState(null);  // Store audio blob

  const saveAudio = (blob) => {
    setAudioBlob(blob);
  };
  
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

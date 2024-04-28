import React, { useState } from 'react';
import '../css/HomePage.css';

// Sidebar for chat history
const Sidebar = ({ chatHistory }) => (
  <div className="w-1/4 bg-[#ebf8ff] p-4 overflow-y-auto">
    <h2 className="text-xl font-bold">Chat History</h2>
    <ul>
      {chatHistory.map((msg, index) => (
        <li className="text-blue-700" key={index}>{msg}</li> 
      ))}
    </ul>
  </div>
);

// Main chat box
const ChatBox = ({ currentMessage, setCurrentMessage, sendMessage }) => (
  <div className="flex flex-col h-full">
    <div className="flex-1 bg-white border-blue-200 border-1 p-4 overflow-y-auto">
      {/* Display area for future messages */}
    </div>
    <div className="flex mt-2">
      <input
        type="text"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 border-1 border-blue-300 p-2 rounded-lg"
      />
      <button onClick={sendMessage} className="ml-2 bg-blue-500 text-white p-2 rounded-lg">Send</button>
    </div>
  </div>
);

// Main HomePage component
const HomePage = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [currentMessage, setCurrentMessage] = useState(''); // Correct useState initialization

  const sendMessage = () => {
    if (currentMessage.trim() !== '') {
      setChatHistory([...chatHistory, currentMessage]);
      setCurrentMessage(''); // Clear input after sending
    }
  };

  return (
    <div className="flex flex-col h-screen bg-blue-50">
      <div className="w-full bg-slate-700 p-3 text-center text-white"> 
        <div className="w-12 h-12 bg-[#d1d5db] rounded-full mx-auto m-0">
          <img src="/src/assets/CompanyLogo.png" alt="Company Logo" className="rounded-full" />
        </div>
      </div>

      <div className="flex flex-row flex-1"> 
        <Sidebar chatHistory={chatHistory} /> 

        <div className="flex-1 p-4 bg-blue-50"> 
          <ChatBox
            currentMessage={currentMessage}
            setCurrentMessage={setCurrentMessage}
            sendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;

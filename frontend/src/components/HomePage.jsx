import React, { useState, useEffect } from 'react';
import '../css/HomePage.css';
import { db } from '../firebase';
import { collection, getDocs, query, where, addDoc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import Message from './Message';

// Sidebar for chat history
const Sidebar = ({ chatHistory, onChatHistoryClick }) => {
  return (
    <div className="sidebar">
      <h2>Chat History</h2>
      <p>+</p>
      <ul>
        {chatHistory.map((msg, index) => (
          <li key={index} onClick={() => onChatHistoryClick(msg)}>
            {msg.convo[0].text}
          </li>
        ))}
      </ul>
    </div>
  );
};



// Main chat box
const ChatBox = ({ user }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [convo,setConvo] = useState([]);

  const handleSendMessage = async () => {
    if (currentMessage.trim() !== '') {
      const messageData = {
        text: currentMessage,
        timestamp: new Date(),
      };

      // Get the document reference for the user's conversation
      const q = query(collection(db, 'message'), where('uid', '==', user.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
          // Get the existing conversation array
          const existingConvo = doc.data().convo;

          // Add the new message to the conversation array
          const updatedConvo = [...existingConvo, messageData];

          // Update the conversation array in the document
          await updateDoc(doc.ref, { convo: updatedConvo });
          setConvo(updatedConvo);

          console.log('Message sent and conversation updated:', messageData);

          // No need to update local state here, as it will be handled by the effect's dependency array

          // Clear input field
          setCurrentMessage('');
        });
      }
    }
  };

  useEffect(() => {
    const fetchOrCreateConversation = async () => {
      if (user) {
        const q = query(collection(db, 'message'), where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          // If no document exists for the user, create one
          const userData = {
            avatar: user.photoURL,
            convo: [], 
            uid: user.uid,
            username: user.displayName || user.email,
          };
          await addDoc(collection(db, 'message'), userData);
          console.log('New conversation document created for user:', user.uid);
        } else {
          // Document exists, log the conversation
          const convoDoc = querySnapshot.docs[0]; // Assuming there's only one document per user
          const convoData = convoDoc.data().convo;
          console.log('Conversation found:', convoData);
          // Set the conversation data to state
          setConvo(convoData);
        }
      }
    };
  
    fetchOrCreateConversation();
  }, [user]); // Run effect when user changes

  return (
    <div className="chatbox">
      <div className="content">
        {convo.map((message, index) => (
          <Message key={index} userPhotoURL={user.photoURL} messageText={message.text} />
        ))}
      </div>
      <div className="input-section">
        <input
          type="text"
          placeholder="Type a message..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

// Main HomePage component
const HomePage = () => {
  const [user] = useAuthState(auth);
  const [chatlog, setChatlog] = useState([]);
  const [selectedChatLog, setSelectedChatLog] = useState(null);

  useEffect(() => {
    const fetchOrCreateConversation = async () => {
      if (user) {
        const q = query(collection(db, 'message'), where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const messageDocs = querySnapshot.docs.map(doc => doc.data());
          setChatlog(messageDocs);
          console.log('Message documents found:', messageDocs);
        } 
      }
    };

    fetchOrCreateConversation();
  }, [user]);

  const handleChatHistoryClick = (chatlog) => {
    setSelectedChatLog(chatlog);
  };

  return (
    <div className="flex flex-col h-screen bg-blue-50">
      <div className="navbar">
        <div className="logo-placeholder">
          <img src="/src/assets/CompanyLogo.png" alt="Company Logo" className="rounded-full" />
        </div>
      </div>

      <div className="flex flex-row flex-1">
        <Sidebar chatHistory={chatlog} onChatHistoryClick={handleChatHistoryClick} />
        <div className="flex-1 p-4 bg-blue-50">
          <ChatBox user={user} chatLog={selectedChatLog} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;

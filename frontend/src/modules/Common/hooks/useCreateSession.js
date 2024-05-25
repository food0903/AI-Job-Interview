import { useState } from "react";
import axios from "axios";

export const useCreateSession = (uid) => {
  const [sessionID, setSessionID] = useState(null);
  const [isloading, setIsLoading] = useState(false);

  const createSession = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_PUBLIC_API_URL}/create_session`, { uid });
      setSessionID(response.data.sid);
      return response.data.sid;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  };

  return { sessionID, createSession, isloading};
};
